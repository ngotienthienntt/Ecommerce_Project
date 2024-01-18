'use strict'

// const config = {
//     app: {
//         port: 3000
//     },
//     db: {
//         host: 'localhost',
//         port: 27017,
//         name: 'db'
//     }
// }

//lv01

const dev = {
    app: {
        port: process.env.DEV_APP_PORT
    },
    db: {
        host: process.env.DEV_DB_HOST,
        port: process.env.DEV_DB_PORT,
        name: process.env.DEV_DB_NAME
    },
    redis: {
        url: process.env.DEV_REDIS_URI
    },
    discord: {
        channel_id: process.env.DEV_CHANNEL_ID_DISCORD,
        token: process.env.DEV_TOKEN_DISCORD
    }
}

const pro = {
    app: {
        port: process.env.PRO_APP_PORT
    },
    db: {
        host: process.env.PRO_DB_HOST,
        port: process.env.PRO_DB_PORT,
        name: process.env.PRO_DB_NAME
    },
    redis: {
        url: process.env.PRO_REDIS_URI
    },
    discord: {
        channel_id: process.env.PRO_CHANNEL_ID_DISCORD,
        token: process.env.PRO_TOKEN_DISCORD
    }
}

const config = {dev, pro}
const env = process.env.NODE_ENV || 'dev';
module.exports = config[env];