"use trict";

//!dmbg
const { Schema, model, Types } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

// Declare the Schema of the Mongo model
const DiscountSchema = new Schema(
    {
        discount_name: { type: String, required: true},
        discount_description: { type: String, required: true},
        discount_type: { type: String, default: "fixed_amount"}, //percentage
        discount_value: { type: Number, required: true}, //10.000 10%
        discount_code: { type: String, required: true}, //
        discount_start_date: { type: Date, required: true}, //
        discount_end_date: { type: Date, required: true}, //
        discount_max_uses: { type: Number, required: true}, //max number of discount will be applied
        discount_uses_count: { type: Number, required: true}, //number of discount were used
        discount_user_used: { type: Array, default: []}, //list users applied discount
        discount_max_use_per_user: { type: Number, required: true}, //
        discount_min_order_value: { type: Number, required: true}, //
        discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop"}, //
        discount_is_active: { type: Boolean, default: true}, //
        discount_applies_to: { type: String, required: true, enum: ["all", "specific"]}, //
        discount_product_ids: { type: Array, default: []}, //
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

//Export the model
module.exports = {
    inventory: model(DOCUMENT_NAME, DiscountSchema)
};
