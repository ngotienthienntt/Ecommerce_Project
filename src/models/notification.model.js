"use strict"

//!dmbg
const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Notification"
const COLLECTION_NAME = "Notifications"

//ORDER-001: order successfull
//ORDER-002: order fail
//PROMOTION-001: New promotion
//SHOP-001: new product for user following

// Declare the Schema of the Mongo model
const NotificationSchema = new Schema({
    noti_type: {type: String, enum: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001"], required: true},
    noti_senderId: {type: Schema.Types.ObjectId, required: true, ref: "Shop"},
    noti_receivedId: {type: String , required: true},
    noti_content: {type: String, required: true},
    noti_options: {type: Object, default: {}}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, NotificationSchema);