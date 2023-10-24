"use strict"
const _ = require("lodash");
const crypto = require("crypto");
const { Types } = require("mongoose");

const convertToObjectId = id => new Types.ObjectId(id);

const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(object, fields);
}

const randomKeyPair = (numByte = 64, format = "hex") => {
    const privateKey = crypto.randomBytes(numByte).toString(format);
    const publicKey = crypto.randomBytes(numByte).toString(format);

    return {privateKey, publicKey};
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]));
}

const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]));
}

const removeUndefineObject = (obj) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') removeUndefined(obj[key]);
        else if (obj[key] == null) delete obj[key];
    });

    return obj;
}

const updateNestedObjectParser = (obj) => {
    const final = {}
    Object.keys(obj).forEach(k => {
        if(typeof obj[k] === 'object' && !Array.isArray(obj[k])){
            const response = updateNestedObjectParser(obj[k]);
            Object.keys(response).forEach(a => {
                final[`${k}.${a}`] = response[a];
            })
        }else{
            final[k] = obj[k];
        }
    })

    return final;
}



module.exports = {
    getInfoData,
    randomKeyPair,
    getSelectData,
    getUnSelectData,
    removeUndefineObject,
    updateNestedObjectParser,
    convertToObjectId,
}