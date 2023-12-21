const redisPubsubService = require("../services/redis.Pubsub.service");

class InventoryServiceTest {
    constructor(){
        redisPubsubService.subcribe('purchase_events', (channel, payload) => {
            InventoryServiceTest.updateInventory(payload);
        })
    }

    static updateInventory({productId, quantity}){
        console.log(`Update product id ${productId} with quantity ${quantity}`);
    }
}

module.exports = new InventoryServiceTest();