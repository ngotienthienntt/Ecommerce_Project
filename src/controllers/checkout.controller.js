'use strict'
const { CREATED, OK } = require("../core/success.response");
const checkoutService = require("../services/checkout.service");

class CheckoutController {
    checkoutReview = async(req, res, next) => {
        const result = await checkoutService.checkoutReview({
            ...req.body,
        })

        new CREATED({
            message: "checkout review cart successfully",
            metadata: result
        }).send(res);
    }
}

module.exports = new CheckoutController;