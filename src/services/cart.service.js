"use strict"
const { NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");

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
                "cart_products.$.quantity": quantity,
            }
        },
        options = {
            upsert: true,
            new:true
        }

        return await cartModel.findOneAndUpdate(query, updateSet, options)
    }

    static async addNewProductInCart({userId, product}){
        const query = {
            cart_userId: userId,
            cart_state: "active"
        },
        updateSet = {
            $push: {
                "cart_products": product,
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
        const cartProducts = userCart.cart_products;
        const foundProduct = cartProducts.find(e => e.productId == product.productId );
        //cart with product
        if(foundProduct){
            return await this.updateUserCartQuantity({userId, product});
        }else {
            return await this.addNewProductInCart({ userId, product});
        }

    }

    //update cart
    /*
        shop_order_ids:[
            {
                shopId,
                item_products: [
                    quantity,
                    price,
                    shopId,
                    old_quantity,
                    productId
                ],
                version
            }
        ]0
    */
    static async addToCartV2({userId, shop_order_ids}){
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]

        const foundProduct = await getProductById(productId);
        if(!foundProduct){
            throw new NotFoundError("Product not found!!!");
        }

        if(foundProduct.product_shop.toString() !== shop_order_ids[0].shopId){
            throw new NotFoundError("Product do not belong to the shop!!!")
        }

        if(quantity === 0){
            //delete product in cart
        }

        return await this.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity,
            }
        })
    }

    static async deleteUserCart({userId, productId}){
        const query = {cart_userId: userId, cart_state: "active"},
        updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        }

        const deleteCart = await cartModel.updateOne(query, updateSet)
        return deleteCart;
    }

    static async getListUserCart({userId}){
        return await cartModel.findOne({
            cart_userId: +userId
        }).lean();
    }
}

module.exports = CartService;