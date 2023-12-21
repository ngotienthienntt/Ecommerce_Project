'use strict'
const { CREATED, OK } = require("../core/success.response");
const inventoryService = require("../services/inventory.service");

class InventoryController {
    addStockToInventory = async(req, res, next) => {
        const result = await inventoryService.addStockToInventory({
            ...req.body,
        })

        new CREATED({
            message: "add stock to inventory successfully",
            metadata: result
        }).send(res);
    }
}

module.exports = new InventoryController;