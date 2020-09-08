require('dotenv').config({path: __dirname + '/.env'})
const Bot = require('./src/Bot')

const b = new Bot(process.env['BOT_TOKEN']);
