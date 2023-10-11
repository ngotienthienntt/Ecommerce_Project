"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const keyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError, ServerError, ForbiddenError } = require("../core/error.response");
const { findByEmail } = require("./../services/shop.service");
const { randomKeyPair } = require("../utils")

const RoleShop = {
    SHOP: "000",
    WRITER: "001",
    EDITOR: "002",
    ADMIN: "004",
};

class AccessService {

    static handlerRefreshToken = async ( refreshToken) => {
        //check token đã được sử dụng chưa
        const foundToken =  await keyTokenService.findByRefreshTokenUsed({refreshToken});
        if(foundToken){

            //decode xem ai
            const { userId } = await verifyJWT(refreshToken, foundToken.privateKey);

            //xóa tất cả trong key store
            await keyTokenService.deleteKeyById({userId})

            throw new ForbiddenError("Something wrong. Please relogin!!!")
        }

        const holderToken = await keyTokenService.findByRefreshToken({refreshToken})
        if(!holderToken){
            throw new AuthFailureError("Shop not exist!!! 1")
        }

        //verify token
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey);
        
        const foundShop = await findByEmail({email})
        if(!foundShop){
            throw new AuthFailureError("Shop not exist!!! 2")
        }

        //tạo token mới
        const tokens = await createTokenPair(
            { userId: userId, email },
            holderToken.publicKey,
            holderToken.privateKey
        );

        //update token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }

        })

        return  {
            user: {userId, email},
            tokens
        }
    }

    static logout = async ( keyStore) => {
        const delKey = await keyTokenService.removeKeyById(keyStore._id); 
        return delKey;
    }
    
    static login = async ({email, password}) => {
        //1. check email, password
        const foundShop = await findByEmail({email});
        const match = bcrypt.compare(password, foundShop.password);
        if(!match){
            throw new AuthFailureError("Authentication error");
        }

        //2.reset token
        const { privateKey, publicKey } = randomKeyPair();
        const { _id: userId } = foundShop
        const tokens = await createTokenPair(
            { userId, email },
            publicKey,
            privateKey
        );

        await keyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId
        })

        //3.send response   
        return {
            shop: getInfoData({ fields: ["_id", "name", "email"], object: foundShop }),
            tokens
        }

    }
    static signUp = async ({ name, email, password }) => {
        //step 1 check email exist
        const hoderShop = await shopModel.findOne({ email }).lean();
        if (hoderShop) {
            throw new BadRequestError("Error: Shop already exist");
        }

        //step 2 create account
        const hashPassword = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name,
            email,
            password: hashPassword,
            roles: [RoleShop.SHOP],
        });

        //step 3 create token
        if (newShop) {
            const { privateKey, publicKey } = randomKeyPair();


            // console.log("publickeystring: ", publicKeyString);

            // const publicKeyObject = crypto.createPublicKey(publicKeyString);

            // console.log("publickeyobject", publicKeyObject);
            //create token pair

            const tokens = await createTokenPair(
                { userId: newShop._id, email },
                publicKey,
                privateKey
            );

            const keystore = await keyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey: publicKey,
                privateKey: privateKey,
                refreshToken: tokens.refreshToken
            });

            if (!keystore) {
                throw new ServerError("Internal server error");
            }

            return {
                code: 201,
                metaData: {
                    shop: getInfoData({
                        fields: ["_id", "name", "email"],
                        object: newShop,
                    }),
                    tokens,
                },
            };
        }

        return {
            code: 201,
            metaData: null,
        };
    };
}

module.exports = AccessService;
