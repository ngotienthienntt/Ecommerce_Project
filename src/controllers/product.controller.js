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

    publishProductByShop = async (req, res, next) => {
        const productId = req.params.id || '';
        const result = await productService.publishProductByShop({
            product_id: productId,
            product_shop: req.user.userId
        })
        new OK({
            message: "Publish product success",
            metadata: result
        }).send(res);
    }

    unpublishProductByShop = async (req, res, next) => {
        const productId = req.params.id || '';
        const result = await productService.unpublishProductByShop({
            product_id: productId,
            product_shop: req.user.userId
        })
        new OK({
            message: "UnPublish product success",
            metadata: result
        }).send(res);
    }

    /**
     * @desc 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next
     * @return 
     */
    getAllDraftsForShop = async (req, res, next) => {
        const result = await productService.findAllDraftsForShop({
            product_shop: req.user.userId,
        });

        new OK({
            message: "Get list draft products  success",
            metadata: result
        }).send(res)
    }

    getAllPublishsForShop = async (req, res, next) => {
        const result = await productService.findAllPublishsForShop({
            product_shop: req.user.userId,
        });

        new OK({
            message: "Get list publish products success",
            metadata: result
        }).send(res)
    }

    getlistSearchProduct = async (req, res, next) => {
        const result = await productService.searchProduct(req.params);
        new OK({
            message: "Get list search products success",
            metadata: result
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        const data = req.params;
        const result = await productService.findAllProducts(data);
        new OK({
            message: "Find all products success",
            metadata: result
        }).send(res)
    }

    findProduct =  async (req, res, next) => {
        const product_id = req.params.id
        const result = await productService.findProduct({product_id})

        new OK({
            message: "Find product success",
            metadata: result
        }).send(res)
    }
}

module.exports = new ProductController();