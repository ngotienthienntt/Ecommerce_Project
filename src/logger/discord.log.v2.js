const {Client, GatewayIntentBits} = require("discord.js")
const {  discord: { channel_id, token} } = require('../configs/config.app');


class LoggerUtil {
    constructor(){
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })

        this.channelId = channel_id 
        this.client.on("ready", () => {
            console.log(`Logger is ready as ${this.client.user.tag}`)
        })
        this.client.login(token)
    }

    sendToFormatCode(logData){
        const {code, message = "This is some information about the code", title = "Code Example"} = logData
        if(1 == 1){
            //check product or dev 
        }
        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00', 16),
                    title,
                    description: '```json\n' +  JSON.stringify(code, null, 2) + '\n```'
                }
            ]
        }

        this.sendToMessage(codeMessage) 
    }

    sendToMessage(message = "message"){
        const channel = this.client.channels.cache.get(this.channelId )
        if(!channel){
            console.err("couldn't find channel")
            return;
        }

        channel.send(message).catch(e => console.log(e))
    }
}

const loggerUtil = new LoggerUtil();

module.exports = loggerUtil