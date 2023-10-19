
const { product, clothing, electronic, furniture } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const { updateProductById } = require("../models/repositories/product.repo");
const { insertInventory } = require("../models/repositories/inventory.repo");
const { removeUndefineObject, updateNestedObjectParser } = require("../utils");


//create base product class

class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes
    }){
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    async createProduct(product_id){
        const newProduct = await product.create({ ...this, _id: product_id});

        if(newProduct){
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
        }

        return newProduct;
    }

    async updateProduct(productId, bodyUpdate){
        return await updateProductById({productId, bodyUpdate, model: product})
    }
}

//define subclass for different class type clothing

class Clothing extends Product {
    async createProduct(){
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if(!newClothing){
            throw new BadRequestError("Create new Clothing error");
        }

        const newProduct = await super.createProduct(newClothing._id);
        if(!newProduct){
            throw new BadRequestError("Create new Product error");
        }

        return newProduct;
    }

    async updateProduct(productId){

        //1. remove null/undefine field, format object
        const objectParams = removeUndefineObject(this); 
        //2. check what fields need update
        if(objectParams.product_attributes){
            //update child
            const productAttributesFormat = updateNestedObjectParser(objectParams.product_attributes);
            await updateProductById({
                productId, 
                bodyUpdate: productAttributesFormat,
                model: clothing
            })
        }

        const productFormat = updateNestedObjectParser(objectParams);
        const updateProduct = await super.updateProduct(productId, productFormat);

        return updateProduct;
    }
}

//define subclass for different class type electronic

class Electronics extends Product {
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if(!newElectronic){
            throw new BadRequestError("Create new Electronic error");
        }

        const newProduct = super.createProduct(newElectronic._id );
        if(!newProduct){
            throw new BadRequestError("Create new Product error");
        }

        return newProduct;
    }

    async updateProduct(productId){

        //1. remove null/undefine field, format object
        const objectParams = removeUndefineObject(this); 
        //2. check what fields need update
        if(objectParams.product_attributes){
            //update child
            const productAttributesFormat = updateNestedObjectParser(objectParams.product_attributes);
            await updateProductById({
                productId, 
                bodyUpdate: productAttributesFormat,
                model: electronic
            })
        }

        const productFormat = updateNestedObjectParser(objectParams);
        const updateProduct = await super.updateProduct(productId, productFormat);

        return updateProduct;
    }
}


class Furniture extends Product {
    async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        });
        if(!newFurniture){
            throw new BadRequestError("Create new Furniture error");
        }

        const newProduct = await super.createProduct(newFurniture._id);
        if(!newProduct){
            throw new BadRequestError("Create new Product error");
        }

        return newProduct;
    }

    async updateProduct(productId){

        //1. remove null/undefine field, format object
        const objectParams = removeUndefineObject(this); 
        //2. check what fields need update
        if(objectParams.product_attributes){
            //update child
            const productAttributesFormat = updateNestedObjectParser(objectParams.product_attributes);
            await updateProductById({
                productId, 
                bodyUpdate: productAttributesFormat,
                model: furniture
            })
        }

        const productFormat = updateNestedObjectParser(objectParams);
        const updateProduct = await super.updateProduct(productId, productFormat);

        return updateProduct;
    }
}

module.exports = {
    "Clothing": Clothing,
    "Electronics": Electronics,
    "Furniture": Furniture,
}