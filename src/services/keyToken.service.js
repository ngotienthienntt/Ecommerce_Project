"use strict"
const keyTokenModel = require("../models/keytoken.model");

class KeyToken {
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            //lv000
            // const tokens =  await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })

            // return tokens ? tokens.publicKey: null;

            //lvxxx
            const filter = {
                user: userId
            };
            const update = {
                publicKey, 
                privateKey,
                refreshTokenUsed: [],
                refreshToken 
            };
            const options = {
                upsert: true,
                new: true
            };

            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey: null 
        } catch (error) {
            return error;
        }
    }
}

module.exports = KeyToken;