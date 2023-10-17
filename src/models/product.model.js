"use strict"

//!dmbg
const { Schema, model, Types } = require("mongoose"); // Erase if already required
const slugify = require("slugify");
const PRODUCT_DOCUMENT_NAME = "Product";
const PRODUCT_COLLECTION_NAME = "Products";

const CLOTHING_DOCUMENT_NAME = "Clothing";
const CLOTHING_COLLECTION_NAME = "Clothings";

const ELECTRONIC_DOCUMENT_NAME = "Electronic";
const ELECTRONIC_COLLECTION_NAME = "Electronics";


const FURNITURE_DOCUMENT_NAME = "Furniture";
const FURNITURE_COLLECTION_NAME = "Furnitures";

// Declare the Schema of the Mongo model
const ProductSchema = new Schema({
    product_name: { //quan jean cao cap
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

    product_slug: {  ///quan-jean-cao-cap
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
        ref: "Shop"
    },

    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    },

    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "rating must be above 1.0"],
        max: [5, "rating must be below 5.0"],
        set: (val) => Math.round(val * 10)/10 
    },

    product_variations: {
        type: Array,
        default: []
    },

    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },

    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }
}, {
    timestamps: true,
    collection: PRODUCT_COLLECTION_NAME
});

//document middleware run before.save() and create()...
//webhub
ProductSchema.pre("save", function(next){
    this.product_slug = slugify(this.product_name, {lower: true});
    next();
})
 
//create index for search
ProductSchema.index({product_name: "text", product_description: "text"});

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