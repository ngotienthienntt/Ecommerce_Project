"use strict"

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization"
}

const apiKeyService = require("../services/apikey.service");

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if(!key){
            return res.status(403).json({
                message: "Forbidden Error"
            })
        }

        //check objkey
        const objKey = await apiKeyService.findById(key);
        if(!objKey){
            return res.status(403).json({
                message: "Forbidden Error"
            })
        }

        req.objKey = objKey
        return next();

    } catch (error) {
        
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if(!req.objKey.permissions){
            return res.status(403).json({
                message: "Permission denied"
            })
        }

        const validPermisson = req.objKey.permissions.includes(permission);
        if(!validPermisson){
            return res.status(403).json({
                message: "Permission denied"
            })
        }

        return next();
    }
} 

module.exports = {
    apiKey,
    permission
}