"use strict"
const cartModel = require("../models/cart.model");

class CartService {

    static async createUserCart({userId, product}){
        const query = {
            cart_userId: userId,
            cart_state: "active"
        };

        const updateOrInsert = {
            $addToSet: {
                cart_product: product,
            }
        }

        const options = {
            upsert: true,
            new: true
        }

        return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({userId, product}){
        const { productId, quantity } = product
        const query = {
            cart_userId: userId,
            "cart_products.productId":  productId,
            cart_state: "active"
        },
        updateSet = {
            $inc: {
                "cart_products.$.quantity": quantity
            }
        },
        options = {
            upsert: true,
            new:true
        }

        return await cartModel.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCart({ userId, product = {}}){
        const userCart = await cartModel.findOne({
            cart_userId: userId,
        });

        //not have cart
        if(!userCart){
            //create cart for user
            return await this.createUserCart({userId, product});
        }

        //cart with empty product
        if(!userCart.cart_products.length){
            userCart.cart_products = [product]

            return await userCart.save();
        }

        //cart with product
        return await this.updateUserCartQuantity({userId, product});

    }
}

module.exports = CartService;