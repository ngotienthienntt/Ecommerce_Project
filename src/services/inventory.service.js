"use strict"

const { BadRequestError } = require("../core/error.response");
const { inventory } = require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repo");

class InventoryService{
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = '124, Tran phu, HCM city'
    }){
        const product = await getProductById(productId);
        if(!product){
            throw new BadRequestError("The product doesn't exist!!")
        }

        const query = {
            inven_shopId: shopId, inven_productId: productId
        },
        updateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        },
        options = {
            upsert: true,
            new: true
        }

        return inventory.findOneAndDelete(query, updateSet, options);
    }
}

module.exports = InventoryService