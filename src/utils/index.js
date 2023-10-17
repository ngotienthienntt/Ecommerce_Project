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

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]));
}

const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]));
}

module.exports = {
    getInfoData,
    randomKeyPair,
    getSelectData,
    getUnSelectData,
}