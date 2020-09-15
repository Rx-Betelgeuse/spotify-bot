require('dotenv').config({path: __dirname + '/.env'})
const Bot = require('./src/Bot')

const BOT_TOKEN = process.env['BOT_TOKEN'];
const bot = new Bot(BOT_TOKEN);

bot.run()
