"use strict"

const { BadRequestError } = require("../core/error.response");
const productConfig = require("./product.config");
const { 
    findAllDraftsForShop,
    findAllPublishsForShop,
    publishProductByShop,
    unpublishProductByShop,
    searchProductByUser
 } = require("../models/repositories/product.repo");

//define factory product to create product
class ProductFactory {
    static productRegistry = {};

    static registerProductType(type, classRef){
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(type, payload){
        const productClass = ProductFactory.productRegistry[type];
        if(!productClass) throw new BadRequestError("Invalid product type")
        return new productClass(payload).createProduct();
    }

    static async publishProductByShop({ product_shop,product_id }){
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unpublishProductByShop({ product_shop, product_id }){
        return await unpublishProductByShop({ product_shop, product_id })
    }

    static async findAllDraftsForShop({product_shop, limit = 50, skip = 0}){
        const query = {
            product_shop,
            isDraft: true
        }

        return await findAllDraftsForShop({query, limit, skip})
    }


    static async findAllPublishsForShop({product_shop, limit = 50, skip = 0}){
        const query = {
            product_shop,
            isPublished: true
        }

        return await findAllPublishsForShop({query, limit, skip})
    }

    static async searchProduct({ keySearch }){
        return await searchProductByUser({ keySearch })
    }
}

for (const key in productConfig) {
    ProductFactory.registerProductType(key, productConfig[key]);
}


//create base product class

// class Product {
//     constructor({
//         product_name, product_thumb, product_description, product_price,
//         product_quantity, product_type, product_shop, product_attributes
//     }){
//         this.product_name = product_name;
//         this.product_thumb = product_thumb;
//         this.product_description = product_description;
//         this.product_price = product_price;
//         this.product_quantity = product_quantity;
//         this.product_type = product_type;
//         this.product_shop = product_shop;
//         this.product_attributes = product_attributes;
//     }

//     async createProduct(product_id){
//         return await product.create({ ...this, _id: product_id});
//     }
// }

// //define subclass for different class type clothing

// class Clothing extends Product {
//     async createProduct(){
//         const newClothing = await clothing.create({
//             ...this.product_attributes,
//             product_shop: this.product_shop
//         });
//         if(!newClothing){
//             throw new BadRequestError("Create new Clothing error");
//         }

//         const newProduct = await super.createProduct(newClothing._id);
//         if(!newProduct){
//             throw new BadRequestError("Create new Product error");
//         }

//         return newProduct;
//     }
// }

// //define subclass for different class type electronic

// class Electronics extends Product {
//     async createProduct(){
//         const newElectronic = await electronic.create({
//             ...this.product_attributes,
//             product_shop: this.product_shop
//         });
//         if(!newElectronic){
//             throw new BadRequestError("Create new Electronic error");
//         }

//         const newProduct = super.createProduct(newElectronic._id );
//         if(!newProduct){
//             throw new BadRequestError("Create new Product error");
//         }

//         return newProduct;
//     }
// }


// class Furniture extends Product {
//     async createProduct(){
//         const newFurniture = await furniture.create({
//             ...this.product_attributes,
//             product_shop: this.product_shop
//         });
//         if(!newFurniture){
//             throw new BadRequestError("Create new Furniture error");
//         }

//         const newProduct = await super.createProduct(newFurniture._id);
//         if(!newProduct){
//             throw new BadRequestError("Create new Product error");
//         }

//         return newProduct;
//     }
// }

//register product type
// ProductFactory.registerProductType("Clothing", Clothing);
// ProductFactory.registerProductType("Electronics", Electronics);
// ProductFactory.registerProductType("Furniture", Furniture); 


module.exports = ProductFactory