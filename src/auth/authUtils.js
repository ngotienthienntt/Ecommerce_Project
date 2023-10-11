"use strict"
const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");


const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization",
    CLIENT_ID: "x-client-id"
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: "2 days"
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: "7 days"
        });

        return { accessToken, refreshToken };
    } catch (error) {
        return error;
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /*
        1 - check userId misssing?
        2 - get accessToken
        3 - verify accessToken
        4 - check user id bds
        5 - check keystore with this userid
        6 - ok all => return next
    */

    //1
    const userId = req.headers[HEADER.CLIENT_ID];
    if(!userId){
        throw new AuthFailureError('Invalid Request');
    }

    //2
    const keyStore = await findByUserId({ userId });
    if(!keyStore){
        throw new NotFoundError('Not found key store');
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if(!accessToken){
        throw new AuthFailureError('Invalid Request');
    }

    //3
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if(userId != decodeUser.userId){
            throw new AuthFailureError('Invalid User id');
        }
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error;
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}