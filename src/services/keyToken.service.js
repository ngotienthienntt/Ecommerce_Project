"use strict"
const keyTokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");

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

    static findByUserId = async ({userId}) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) });
    }

    static removeKeyById =  async ({id}) => {
        return await keyTokenModel.deleteOne({_id: new Types.ObjectId(id)});
    }

    static findByRefreshTokenUsed = async ({refreshToken}) => {
        return await keyTokenModel.findOne({refreshTokenUsed: refreshToken}).lean();
    }

    static findByRefreshToken = async ({refreshToken}) => {
        return await keyTokenModel.findOne({ refreshToken });
    }

    static deleteKeyById = async ({userId})=> {
        return await keyTokenModel.deleteOne({user: userId});
    }
}

module.exports = KeyToken;