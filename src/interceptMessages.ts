require('dotenv').config({path: __dirname + '/.env'})
import * as TelegramBot from "node-telegram-bot-api";
import {Message} from "node-telegram-bot-api";

const token: string | undefined = process.env['BOT_TOKEN'];

if(token) {
    const bot = new TelegramBot(token, { polling: true });

    const interceptMessage = async (message: Message) => {
        console.log(message)
        // errorLogger.info(message);
    };

    bot.on("message", interceptMessage);
}
