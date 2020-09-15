const chalk = require('chalk');
const TelegramBot = require('node-telegram-bot-api');
const lyrics_search = require('@penfoldium/lyrics-search');
const parsing = require('./utils/parsing')

const GeniusLyrics = new lyrics_search(process.env['GENIUS_API_TOKEN']);
const ADMIN_CHAT_ID = process.env['ADMIN_CHAT_ID'];
const PROVIDE_LINK_MESSAGE = `Please, provide a Spotify link (e.g: https://open.spotify.com/track/...)`;


class Bot {
    constructor(token) {
        this.bot = new TelegramBot(token, { polling: true });
    }

    log = (data) => {
        this.bot.sendMessage(ADMIN_CHAT_ID, JSON.stringify(data));
    }

    sendLyrics = (chatId, text) => {
        if (text.length < 4096) {
            this.bot.sendMessage(chatId, text)
        } else {
            const chunks = text.match(/(.|[\r\n]){1,4095}/g);
            chunks.map(async chunk => {
                await this.bot.sendMessage(chatId, chunk)
            })
        }
    }

    stopPendings = () => {
        this.bot.on('message', async (msg) => {
            let dataLog = {
                username: msg.chat.username,
                name: msg.chat.first_name,
                message: msg.text,
            }

            this.log(dataLog);

        })
    }


    run = () => {
        this.bot.on('message', async (msg) => {
            let dataLog = {
                username: msg.chat.username,
                name: msg.chat.first_name,
                message: msg.text,
            }

            const chatId = msg.chat.id;
            const spotifyLink = parsing.getLink(msg.text);
            dataLog.url = spotifyLink

            if (!spotifyLink) {
                this.log(dataLog)
                this.bot.sendMessage(chatId, PROVIDE_LINK_MESSAGE)
                return 0;
            }

            const spotifyDescription = await parsing.grabSpotifySongDescription(spotifyLink);
            const geniusSearchQuery = parsing.extractSongInfo(spotifyDescription);
            const geniusSearchResult = await GeniusLyrics.search(geniusSearchQuery);

            if (geniusSearchResult.lyrics) {
                this.sendLyrics(chatId, geniusSearchResult.lyrics)
                return 0;
            }


            const geniusLyrics = await parsing.grabGeniusLyrics(geniusSearchResult.url);

            if (geniusLyrics.length === 0) {
                const message = geniusSearchResult.url ? `$URL: ${geniusSearchResult.url}` : 'Lyrics not found ¯\\_(ツ)_/¯'
                this.bot.sendMessage(chatId, message)
                return 0;
            }

            this.log(dataLog);
            this.sendLyrics(chatId, geniusLyrics)
        });
    }
}

module.exports = Bot;
