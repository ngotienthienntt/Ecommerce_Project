'use strict'
const { CREATED, OK } = require("../core/success.response");
const cartService = require("../services/cart.service");

class CartController {
    addToCart = async(req, res, next) => {
        const result = await cartService.addToCart({
            ...req.body,
        })

        new CREATED({
            message: "Add product to cart successfull",
            metadata: result
        }).send(res);
    }

    update = async(req, res, next) => {
        const result = await cartService.addToCartV2({
            ...req.body,
        })

        new CREATED({
            message: "Add product to cart successfull",
            metadata: result
        }).send(res);
    }

    delete = async(req, res, next) => {
        const result = await cartService.deleteUserCart({
            ...req.body,
        })

        new OK({
            message: "Delete cart successfull",
            metadata: result
        }).send(res);
    }

    listToCart = async(req, res, next) => {
        const result = await cartService.getListUserCart({
            ...req.query,
        })

        new OK({
            message: "Get list cart successfull",
            metadata: result
        }).send(res);
    }

}

module.exports = new CartController;