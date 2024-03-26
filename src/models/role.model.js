'use trict'

 //!dmbg
 const {Schema, model, Types} = require('mongoose'); // Erase if already required

 const DOCUMENT_NAME = 'Role'
 const COLLECTION_NAME = 'Roles'

//  const grantList = [
//     {role: "admin", resource: "profile", action: 'update:any', atributes: '*'},
//     {role: "admin", resource: "balance", action: 'update:any', atributes: '*, !amount'},

//     {role: "shop", resource: "profile", action: 'update:own', atributes: '*'},
//     {role: "shop", resource: "balance", action: 'update:own', atributes: '*, !amount'},

//     {role: "user", resource: "profile", action: 'update:own', atributes: '*'},
//     {role: "user", resource: "balance", action: 'read:own', atributes: '*'}
//  ]
 
 // Declare the Schema of the Mongo model
 const RoleSchema = new Schema({
    rol_name: {
        type: String,
        default: 'user',
        enum: ['user', 'shop', 'admin']
    },
    rol_slug: {
        type: String,
        required: true
    },
    rol_status: {
        type: String,
        default: 'active',
        enum: ['active', 'block', 'pending']
    },
    rol_description: {
        type: String,
        default: ''
    },
    rol_grants: [
        {
            resource:{ type: Types.ObjectId, ref: 'Resource', required: true},
            actions: [{type: String, required: true}],
            attributes: {type: String, default: '*'}
        }
    ]
 }, {
    timestamps: true,
    collection: COLLECTION_NAME
 });
 
 //Export the model
 module.exports = model(DOCUMENT_NAME, RoleSchema);