const redisPubsubService = require("../services/redis.Pubsub.service");

class ProductServiceTest{
    static purchaseProduct(productId, quantity){
        const order = {
            productId,
            quantity
        }

        redisPubsubService.publish('purchase_events', JSON.stringify(order))
    }
}

module.exports = ProductServiceTest