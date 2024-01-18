"use strict"

const {Client, GatewayIntentBits} = require("discord.js")
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.on('ready', () => {
    console.log(`Logger is at ${client.user.tag}`)
})

const token = "MTE5NjEwMzc3MDg4NzY4NDE0Nw.GZWJXv.-Sf_-iHQRPymo5qMZrZgrlHbckAbU9sHoDlfxQ"
client.login(token);

client.on("messageCreate", msg => {
    if(msg.author.bot) return
    if(msg.content === "hello"){
        msg.reply("Hello!! How can I help you?")
    }
})