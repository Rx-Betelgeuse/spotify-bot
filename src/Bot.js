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

            const url = parsing.getLink(msg.text);

            if(!url) {
                const log = `
[user]: ${msg.chat.first_name}(@${msg.chat.username})
[msg.text]: ${msg.text} 
[url:] ${url}
`;
                this.bot.sendMessage(ADMIN_CHAT_ID, log);
                this.bot.sendMessage(msg.chat.id, 'Link not found')
                return 0;
            }

            const description = await parsing.grabSongDescription(url);

            const query = parsing.extractSongInfo(description);
            const searchResult = await Lyrics.search(encodeURI(query));
            const lyrics = await parsing.grabLyrics(searchResult.url);
            const text = lyrics || searchResult.lyrics || '';

            const log = `
[user]: ${msg.chat.first_name}(@${msg.chat.username})
[msg.text]: ${msg.text} 
[url:] ${url}
[description]: ${description} 
[query]: ${query}
[lyrics.length]: ${text.length}
`;
            this.bot.sendMessage(ADMIN_CHAT_ID, log);

            if (text.length === 0) {
                this.bot.sendMessage(msg.chat.id, 'Oops, something went wrong')
                return 0;
            }

            if (text.length < 4096) {
                this.bot.sendMessage(msg.chat.id, text)
                return 0;
            }

            const chunks = text.match(/(.|[\r\n]){1,4095}/g);
            chunks.map(async chunk => {
                await this.bot.sendMessage(msg.chat.id, chunk)
            })
        });
    }
}

module.exports = Bot;
