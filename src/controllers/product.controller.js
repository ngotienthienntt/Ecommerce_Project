'use strict'
const { CREATED, OK } = require("../core/success.response");
const productService = require("../services/product.service");

class ProductController{
    createProduct = async (req, res, next) => {
        const result = await productService.createProduct(
            req.body.product_type, 
            {
                ...req.body,
                product_shop: req.user.userId
            });
        new CREATED({
            message: "Create product success",
            metadata: result
        }).send(res);
    }
}

module.exports = new ProductController();