const chalk = require('chalk');
const TelegramBot = require('node-telegram-bot-api');
const lyrics_search = require('@penfoldium/lyrics-search');
const parsing = require('./utils/parsing')

const Lyrics = new lyrics_search(process.env['GENIUS_API_TOKEN']);

class Bot {
    constructor(token) {
        this.bot = new TelegramBot(token, {polling: true});

        this.bot.on('message', async (msg) => {
            const url = parsing.getLink(msg.text);
            const description = await parsing.grabSongDescription(url);
            const query = parsing.extractSongInfo(description);
            const searchResult = await Lyrics.search(encodeURI(query));
            const lyrics = await parsing.grabLyrics(searchResult.url);
            const text = lyrics || searchResult.lyrics;
            if(text.length === 0) {
                this.bot.sendMessage(msg.chat.id, 'Oops, something went wrong')
                return 0;
            }
            if(text.length < 4096) {
                this.bot.sendMessage(msg.chat.id, text)
            } else {
                const chunks = text.match(/(.|[\r\n]){1,4095}/g);
                chunks.map(async chunk =>{
                    await this.bot.sendMessage(msg.chat.id, chunk)
                })
            }

        });

        // this.bot.on('message', async (msg) => {
        //     const url = parsing.getLink(msg.text);
        //     console.log(chalk.bold.blue('Url: ', url));
        //     const result = await parsing.grabSongTitle(url);
        //
        //     this.bot.sendMessage(msg.chat.id, result).catch(e=>{
        //         console.log('Error: ' + e.message)
        //     });
        // });
    }
}

module.exports = Bot;
