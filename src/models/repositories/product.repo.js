"use strict"

const { NotFoundError } = require("../../core/error.response");
const { product, electronic, clothing, furniture} = require("../product.model");
const { Types } = require("mongoose");
const { getSelectData, getUnSelectData, convertToObjectId } = require("../../utils/index");

const findAllDraftsForShop = async ({ query, limit, skip}) => {
    return await queryProduct({ query, limit, skip});
}


const findAllPublishsForShop = async ({ query, limit, skip}) => {
    return await queryProduct({ query, limit, skip});
}


const publishProductByShop = async ({product_shop, product_id}) => {
    const foundProduct = await product.findOne({
        _id: new Types.ObjectId(product_id),
        product_shop: new Types.ObjectId(product_shop)
    });

    if(!foundProduct) throw new NotFoundError("Product not found to publish")

    foundProduct.isDraft = false;
    foundProduct.isPublished = true; 
    const { modifiedCount } = await foundProduct.updateOne(foundProduct);

    return modifiedCount;
}


const unpublishProductByShop = async ({product_shop, product_id}) => {
    const foundProduct = await product.findOne({
        _id: new Types.ObjectId(product_id),
        product_shop: new Types.ObjectId(product_shop)
    });

    if(!foundProduct) throw new NotFoundError("Product not found to publish")

    foundProduct.isDraft = true;
    foundProduct.isPublished = false; 
    const { modifiedCount } = await foundProduct.updateOne(foundProduct);

    return modifiedCount;
}

const searchProductByUser = async ({ keySearch }) => {
    const regSearch = new RegExp(keySearch);

    const result = await product.find(
        {
            isPublished: true,
            $text: {
                $search: regSearch
            }
        },
        {
            score: {
                $meta: "textScore"
            }
        }
    ).sort({
        score: {
            $meta: "textScore"
        }
    }).lean()

    return result;
}

const findAllProducts = async ({ limit, sort,  page , filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? {_id: -1}: {_id: 1}

    const products = await product.find(filter)
                        .sort(sortBy)
                        .skip(skip)
                        .limit(limit)
                        .select(getSelectData(select))
                        .lean()

    return products;
}

const findProduct = async ({ product_id, unselect }) => {
    const singleProduct = await product.findOne({
        _id: new Types.ObjectId(product_id)
    }).select(getUnSelectData(unselect))

    return singleProduct;
}

const updateProductById = async ({ productId, bodyUpdate, model, isNew = true}) => {
    return await model.findByIdAndUpdate({_id: productId}, bodyUpdate, {new: isNew});
}

const queryProduct = async ({ query, limit, skip}) => {
    return await product.find(query)
                .populate("product_shop", "name email -_id")
                .sort({updateAt: -1}).skip(skip).limit(limit).lean();
}

const getProductById = async (productId) => {
    return await product.findOne({_id: convertToObjectId(productId)});
}

module.exports = {
    findAllDraftsForShop,
    findAllPublishsForShop,
    publishProductByShop,
    unpublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductById
}