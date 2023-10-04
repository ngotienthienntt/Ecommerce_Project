"use strict"
const _ = require("lodash");
const crypto = require("crypto");


const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(object, fields);
}

const randomKeyPair = (numByte = 64, format = "hex") => {
    const privateKey = crypto.randomBytes(numByte).toString(format);
    const publicKey = crypto.randomBytes(numByte).toString(format);

    return {privateKey, publicKey};
}

module.exports = {
    getInfoData,
    randomKeyPair
}