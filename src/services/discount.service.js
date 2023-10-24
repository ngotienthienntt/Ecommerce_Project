 "use strict"

 const { BadRequestError, NotFoundError } = require("../core/error.response");
 const { discount } = require("../models/discount.model");
 const { convertToObjectId } = require("../utils")
 const { findAllProducts } = require("../models/repositories/product.repo");
 const { checkDiscountExist, findAllDiscountCodesUnSelect, findAllDiscountCodesSelect } = require("../models/repositories/discount.repo");
 class DiscountService {
    static async createDiscountCode(payload){
        const { 
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name, description,
            type, value, max_value, max_uses, uses_count, max_uses_per_user 
        } = payload
        
        // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)){
        //     throw new BadRequestError("Discount code has expired");
        // }

        if (new Date(end_date) <= new Date(start_date)){
            throw new BadRequestError("start date must be greater than end date");
        }

        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectId(shopId)
        }).lean();

        if(foundDiscount && foundDiscount.discount_is_active){
            throw new BadRequestError("Discount exists!!!");
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_use: [],
            discount_shopId: shopId,
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all'? [] : product_ids
        })

        return newDiscount;
    }

    static async updateDiscount(payload){

    }

    //get all available discount code by product

    static async getAllDiscountCodesWithProduct({
        code, shopId, limit, page
    }){

        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectId(shopId)
        }).lean();

        if(foundDiscount && !foundDiscount.discount_is_active){
            throw new BadRequestError("Discount exists!!!");
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount;

        let products;

        if(discount_applies_to === "all"){
            //get all product
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectId(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if(discount_applies_to === "specific"){
            //get all product
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectId(shopId),
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }


        return products;
    }

    static async getAllDiscountCodesByShop({ limit, page, shopId }){
        const discounts = await findAllDiscountCodesSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectId(shopId),
                discount_is_active: true
            },
            select: ["discount_name", "discount_code"],
            model: discount
        });

        return discounts;
    }

    static async getDiscountAmount({codeId, userId, shopId, products}){
        const foundDiscount = await checkDiscountExist({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectId(shopId)
            }
        })

        if(!foundDiscount){
            throw new NotFoundError("Discount doesn't exist!!!");
        }

        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_users_use,
            discount_start_date,
            discount_end_date,
            discount_max_use_per_user,
            discount_value,
            discount_type,
        } = foundDiscount

        if(!discount_is_active){
            throw new NotFoundError("Discount expired !!!");
        }

        if(!discount_max_uses){
            throw new NotFoundError("Discount was out !!!");
        }

        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)){
            throw new BadRequestError("Discount code has expired");
        }

        //check xem có đạt giá trị tối thiểu
        let totalOrder = 0;

        if(discount_min_order_value > 0){
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price);
            }, 0)

            if(totalOrder <  discount_min_order_value){
                throw new NotFoundError(`Discount required a minimum order value of ${discount_min_order_value}`);  
            }
        }

        if(discount_max_use_per_user > 0){
            const userUseDiscount = discount_users_use.find( user => user.userId = userId);
            if(userUseDiscount){
                throw new BadRequestError("User has used this discount already!!!");

            }
        }

        //check fix amount
        const amount = discount_type === "fix_amount" ? discount_value: totalOrder * (discount_value / 100);

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        }

    }

    static async deleteDiscountCode({
        shopId,
        codeId
    }){
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectId(shopId)
        })

        return deleted;
    }


    static async cancelDiscountCode({
        codeId, shopId, userId
    }){
        const foundDiscount = await checkDiscountExist({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectId(shopId)
            }
        });

        if(!foundDiscount){
            throw new NotFoundError("Discount doesn't exist!!!");
        }

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_use: userId
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })

        return result;
    }
 }

 module.exports = DiscountService;