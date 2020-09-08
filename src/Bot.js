const chalk = require('chalk');
const TelegramBot = require('node-telegram-bot-api');
const lyrics_search = require('@penfoldium/lyrics-search');
const parsing = require('./utils/parsing')

const Lyrics = new lyrics_search(process.env['GENIUS_API_TOKEN']);
const ADMIN_CHAT_ID = process.env['ADMIN_CHAT_ID'];

class Bot {
    constructor(token) {
        this.bot = new TelegramBot(token, {polling: true});

        this.bot.on('message', async (msg) => {
            log.info(`
user: ${msg.chat.first_name}(@${msg.chat.username})
text: ${msg.text}
`)

            const url = parsing.getLink(msg.text);
            log.info(`url: ${url}`)

            if(!url) {
                this.bot.sendMessage(msg.chat.id, 'Link not found')
                this.bot.sendMessage(ADMIN_CHAT_ID, `
[user]: ${msg.chat.first_name}(@${msg.chat.username})
[msg.text]: ${msg.text} 
[url:] ${url}
`);
                return 0;
            }

            const description = await parsing.grabSongDescription(url);
            log.info(`description: ${description}`)

            const query = parsing.extractSongInfo(description);
            log.info(`query: ${query}`)
            const searchResult = await Lyrics.search(encodeURI(query));
            const lyrics = await parsing.grabLyrics(searchResult.url);
            log.info(`lyrics.length: ${lyrics.length}`)
            const text = lyrics || searchResult.lyrics || '';

            this.bot.sendMessage(ADMIN_CHAT_ID, `
[user]: ${msg.chat.first_name}(@${msg.chat.username})
[msg.text]: ${msg.text} 
[url:] ${url}
[description]: ${description} 
[query]: ${query}
[lyrics.length]: ${text.length}`);

            if (text.length === 0) {
                this.bot.sendMessage(msg.chat.id, 'Oops, something went wrong')
                return 0;
            }
            if (text.length < 4096) {
                this.bot.sendMessage(msg.chat.id, text)
            } else {
                const chunks = text.match(/(.|[\r\n]){1,4095}/g);
                chunks.map(async chunk => {
                    await this.bot.sendMessage(msg.chat.id, chunk)
                })
            }

        });
    }
}

module.exports = Bot;
