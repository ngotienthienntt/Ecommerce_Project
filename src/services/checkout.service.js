'use strict'
const { findCartById } = require("../models/repositories/cart.repo");
const { BadRequestError } = require("../core/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock} = require("./redis.service");
const order = require("../models/order.model");


class CheckoutService {
    /*
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discount: [],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                },
                {
                    shopId,
                    shop_discount: [
                        {
                            shopId,
                            discountId,
                            codeId
                        }
                    ],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                }
            ]
        }
    */
    static async checkoutReview ({cartId, userId, shop_order_ids}){
        //check cart exist
        const foundCart = await findCartById(cartId);
        if(!foundCart) throw new BadRequestError("Cart does not exist!!!");
         
        const checkout_order = {
            totalPrice: 0, //tong tien hang
            feeShip: 0, //phi van chuyen
            totalDiscount: 0, //tong tien giam
            totalCheckout: 0, //tong thanh toan
        },
        shop_order_ids_new = [];

        for(let i = 0; i < shop_order_ids.length; i++){
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i];
            //check product available
            const checkProductServer = await checkProductByServer(item_products);

            if(!checkProductServer[0]) throw new BadRequestError("order wrong")

            //Tong tien don hang
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price);
            }, 0);

            checkout_order.totalPrice += checkoutPrice;

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer,
            }

            //neu shop discount ton tai thi check lại xem có hợp lệ không
            if(shop_discounts.length > 0){
                //gia sử chỉ có 1 discount
                //get amount discount
                const { totalPrice = 0, discount = 0} = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                });

                 //tong discount
                checkout_order.totalDiscount += discount;

                if(discount > 0){
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount;
                }
            }

            //tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
            shop_order_ids_new.push(itemCheckout);
        }
        
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    //order

    static async orderbyUser(
        shop_order_ids,
        cartId,
        userId,
        user_address,
        user_payment
    ){
        const { shop_order_ids_new, checkout_order } = await this.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        //check lại xem còn hàng không
        //get new array product
        const products = shop_order_ids_new.flatMap(order => order.item_products);
        console.log("product: ", products);
        const acquireProduct = []
        for(let i = 0; i < products.length; i++){
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId);
            acquireProduct.push(keyLock ? true : false);
            if(keyLock){
                releaseLock(keyLock)
            }
        }

        if(acquireProduct.includes(false)){
            throw new BadRequestError("Một số sản phẩm đã được cập nhật, vui lòng quay lại giỏ hàng.");
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: order_payment,
            order_products: shop_order_ids_new
        })

        //success: remove products exist in cart
        if(newOrder){

        }
    }

    //query order
    static async getOrdersByUser(){

    }

     //query order
    static async getOneOrderByUser(){
        
    }

      //query order
    static async cancelOrdersByUser(){
        
    }

    //query order
    static async updateOrderStausByShop(){
    
    }
}


module.exports = CheckoutService