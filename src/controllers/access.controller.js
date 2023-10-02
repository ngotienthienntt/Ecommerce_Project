'use strict'
const { CREATED } = require("../core/success.response");
const accessService = require("../services/access.service");

class AccessController{
    signUp = async function(req, res, next){
        // return res.status(201).json({
        //     message: "",
        //     metadata: ""
        // })
        // return res.status(201).json(await accessService.signUp(req.body));
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