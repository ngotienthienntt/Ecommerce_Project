'use strict'
const { CREATED, OK } = require("../core/success.response");
const discountService = require("../services/discount.service");

class DiscountController {
    createDiscountCode = async(req, res, next) => {
        const result = await discountService.createDiscountCode({
            ...req.body,
            shopId: req.user.userId
        })

        new CREATED({
            message: "Create discount code successfull",
            metadata: result
        }).send(res);
    }

    getAllDiscountCodeByShop = async(req, res, next) => {
        const result = await discountService.getAllDiscountCodesByShop({
            ...req.query,
            shopId: req.user.userId
        })

        new OK({
            message: "Get discount code sucessful",
            metadata: result
        }).send(res);
    }

    getAllDiscountCodeWithProduct = async(req, res, next) => {
        const result = await discountService.getAllDiscountCodesWithProduct({
            ...req.query,
        })

        new OK({
            message: "Get discount code sucessful",
            metadata: result
        }).send(res);
    }

    getDiscountAmount = async(req, res, next) => {
        const result = await discountService.getDiscountAmount({
            ...req.body,
        })

        new OK({
            message: "Get discount amount sucessful",
            metadata: result
        }).send(res);
    }
}

module.exports = new DiscountController;