'use trict'

//!dmbg
const { Schema, model, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

// Declare the Schema of the Mongo model
const CartSchema = new Schema({
    cart_state: {
        type: String,
        required : true,
        enum: ["active", "completed", "failed", "pending"],
        default: "active"
    },
    
    cart_products: {
        type: Array,
        required: true,
        default:[]
    },

    cart_count_proudct: {
        type: Number,
        default: 0,
    },

    cart_userId: {
        type: Number,
        required: true
    }
}, {
   timestamps: true,
   collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, CartSchema);