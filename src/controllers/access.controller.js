'use strict'
const { CREATED, OK } = require("../core/success.response");
const accessService = require("../services/access.service");

class AccessController{
    login = async (req, res, next) => {
        const result = await accessService.login(req.body)
        new OK({
            message: "Login successful",
            metadata: result
        }).send(res);
    }
    signUp = async function(req, res, next){
        const result = await accessService.signUp(req.body)

        new CREATED({
            message: "Register OK",
            metadata: result,
            options: {
                limit: 10
            }
        }).send(res); 
    }
}

module.exports = new AccessController();