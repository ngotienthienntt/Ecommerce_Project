"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");

const RoleShop = {
    SHOP: "000",
    WRITER: "001",
    EDITOR: "002",
    ADMIN: "004",
};

class AccessService {
    static signUp = async ({ name, email, password }) => {
        //step 1 check email exist
        a
        const hoderShop = await shopModel.findOne({ email }).lean();
        if (hoderShop) {
            throw BadRequestError("Error: Shop already exist");
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
            const privateKey = crypto.randomBytes(64).toString("hex");
            const publicKey = crypto.randomBytes(64).toString("hex");

            console.log({ privateKey, publicKey });

            const keystore = await keyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey: publicKey,
                privateKey: privateKey,
            });

            if (!keystore) {
                return {
                    code: "",
                    message: "keystore error",
                };
            }

            // console.log("publickeystring: ", publicKeyString);

            // const publicKeyObject = crypto.createPublicKey(publicKeyString);

            // console.log("publickeyobject", publicKeyObject);
            //create token pair

            const tokens = await createTokenPair(
                { userId: newShop._id, email },
                publicKey,
                privateKey
            );
            console.log("create token: ", tokens);

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
