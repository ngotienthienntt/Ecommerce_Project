'use strict'

const mongoose = require('mongoose');
const os = require('os');
const _SECONDS = 5000;

//count connect
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connection::${numConnection}`);
};

//check overload
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        //Example maximum number of collections base on number of core
        const maxConnections = numCores * 5; //every core can control 5 connection

        console.log(`Active connection: ${numConnection}`);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

        if(numConnection > maxConnections){
            console.log('Connection overload detected'); 
            //notify.send() telegram
        }

    }, _SECONDS) ///monitor every 5 seconds
}

module.exports = { 
    countConnect, 
    checkOverload 
};