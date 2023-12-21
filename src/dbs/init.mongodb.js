'use strict'

const mongoose = require('mongoose');
const {  db: { host, name, port } } = require('../configs/config.app');
const { countConnect } = require('../helpers/check.connection');

const connectString =  `mongodb://${host}:${port}/${name }`;
console.log('connection string: ', connectString);
class Database{
    constructor(){
        this.connect();
    }

    connect(type = 'mongodb'){   
        if(1 === 1){
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true});
        }    

        mongoose.connect(connectString).then(() => {
            console.log('Connect mongodb successful ');
            countConnect();
        }).catch(error => {
            console.log('Error connect mongodb');
        })
    }

    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database();
        }

        return Database.instance;
    }
}


module.exports = Database.getInstance();