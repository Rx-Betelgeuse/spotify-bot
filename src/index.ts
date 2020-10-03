import {parseLyrics} from "./actions.js";
import * as TelegramBot from "node-telegram-bot-api";
import {Message} from "node-telegram-bot-api";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({path: __dirname + '/.env'})

const token = process.env['BOT_TOKEN'];
const bot = new TelegramBot('1248216668:AAGqvoMHpu3GFmiDMm_i7bXRiN3nfOndWrM', { polling: true });
const url = RegExp('http(s):\/\/(open\.spotify\.com|music\.youtube\.com)(.*?)([ ]|$)')

const checkMessage = (message: Message, match: RegExpExecArray | null) => {
    if(match) {
        parseLyrics(bot, message, match[0]);
    }
};

bot.onText(url, checkMessage);
