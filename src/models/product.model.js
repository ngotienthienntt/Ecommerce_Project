"use strict"

//!dmbg
const { Schema, model, Types } = require("mongoose"); // Erase if already required

const PRODUCT_DOCUMENT_NAME = "Product"
const PRODUCT_COLLECTION_NAME = "Products"

const CLOTHING_DOCUMENT_NAME = "Clothing"
const CLOTHING_COLLECTION_NAME = "Clothings"

const ELECTRONIC_DOCUMENT_NAME = "Electronic"
const ELECTRONIC_COLLECTION_NAME = "Electronics"


const FURNITURE_DOCUMENT_NAME = "Furniture"
const FURNITURE_COLLECTION_NAME = "Furnitures"

// Declare the Schema of the Mongo model
const ProductSchema = new Schema({
    product_name: {
        type: String,
        required: true,
    },

    product_thumb: {
        type: String,
        required: true,
    },

    product_description: {
        type: String,
    },

    product_price: {
        type: Number,
        required: true
    },

    product_quantity: {
        type: Number,
        required: true
    },

    product_type: {
        type: String,
        required: true,
        enum: ["Electronics","Clothing", "Furniture"]
    },

    product_shop: {
        type: Schema.Types.ObjectId,
        ref: "shop"
    },

    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    },
}, {
    timestamps: true,
    collection: PRODUCT_COLLECTION_NAME
});

//define product type = clothing

const clothingSchema = new Schema({
    brand: {
        type: String,
        require: true,
    },
    size: String,
    material: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop"
    }
}, {
    timestamps: true,
    collection: CLOTHING_COLLECTION_NAME
})

//define product type = electronic

const electronicSchema = new Schema({
    manufacturer: {
        type: String,
        require: true,
    },
    model: String,
    color: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop"
    }
}, {
    timestamps: true,
    collection: ELECTRONIC_COLLECTION_NAME
})


const furnitureSchema = new Schema({
    brand: {
        type: String,
        require: true,
    },
    size: String,
    material: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop"
    }
}, {
    timestamps: true,
    collection: FURNITURE_COLLECTION_NAME
})


//Export the model
module.exports ={
    product: model(PRODUCT_DOCUMENT_NAME, ProductSchema),
    electronic: model(ELECTRONIC_DOCUMENT_NAME, electronicSchema),
    clothing: model(CLOTHING_DOCUMENT_NAME, clothingSchema),
    furniture: model(FURNITURE_DOCUMENT_NAME, furnitureSchema),
} 