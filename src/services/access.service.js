"use strict"

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const RoleShop = {
    "SHOP": "000",
    "WRITER": "001",
    "EDITOR": "002",
    "ADMIN": "004"
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {
            //step 1 check email exist
            const hoderShop = await shopModel.findOne({email}).lean();
            if(hoderShop){
                return {
                    code: "",
                    message: "Shope is already exist",

                }
            }
            
            //step 2 create account
            const hashPassword = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({
                name,
                email,
                password: hashPassword,
                roles: [RoleShop.SHOP]
            })

            //step 3 create token
            if(newShop){
                const {privateKey, publicKey} = crypto.generateKeyPairSync("rsa",{
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: "pkcs1",
                        format: "pem"
                    },
                    privateKeyEncoding: {
                        type: "pkcs1",
                        format: "pem"
                    }
                })

                console.log({privateKey, publicKey});

                const keystore = await keyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey: publicKey,
                    privateKey: privateKey
                });

                if(!keystore){
                    return {
                        code: "",
                        message: "keystore error"
                    }
                }

                // create token pair
                const privateObjectKey = crypto.createPrivateKey(privateKey);
                const publicObjectKey = crypto.createPublicKey(publicKey);

                const tokens = await createTokenPair(
                    { 
                        userId: newShop._id, 
                        email 
                    },
                    publicObjectKey,
                    privateObjectKey
                )
                console.log("create token: ", tokens);

                return {
                    code: 201,
                    metaData: {
                        shop: getInfoData({ fields: ["_id", "name", "email"], object: newShop }),
                        tokens
                    }
                }
            }

            return {
                code: 201,
                metaData: null
            }
            
        } catch (error) {
            return {
                code: "",
                message: "",
                status: "",
            }
        }
    }
}

module.exports = AccessService