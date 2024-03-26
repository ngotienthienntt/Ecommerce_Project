'use trict'

 //!dmbg
 const {Schema, model, Types} = require('mongoose'); // Erase if already required

 const DOCUMENT_NAME = 'User'
 const COLLECTION_NAME = 'Users'
 
 // Declare the Schema of the Mongo model
 const userSchema = new Schema({
    usr_id: {
        type: Number,
        required: true
    },
    usr_slug: { // id show on fronend
        type: String,
        required: true
    },
    usr_name: {
        type: String,
        default: ''
    },
    usr_password: {
        type: String,
        default: ''
    },
    usr_salf: {
        type: String,
        default: ''
    },
    usr_email: {
        type: String,
        required: true
    },
    usr_phone: {
        type: String,
        default: ''
    },
    usr_sex: {
        type: String,
        default: ''
    },
    usr_avatar: {
        type: String,
        default: ''
    },
    usr_date_of_birth: {
        type: Date,
        default: null
    },
    usr_role: {
        type: Types.ObjectId,
        ref: 'Role'
    },
    usr_status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'active', 'block']
    }
 }, {
    timestamps: true,
    collection: COLLECTION_NAME
 });
 
 //Export the model
 module.exports = model(DOCUMENT_NAME, userSchema);