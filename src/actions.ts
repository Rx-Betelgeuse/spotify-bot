import {Message} from "node-telegram-bot-api";
import * as TelegramBot from "node-telegram-bot-api";
import {messagesLogger} from "./logger.js";
import {extractSongInfo, grabSpotifySongDescription, grabGeniusLyrics} from "./parsing.js";
import * as lyrics_search from '@penfoldium/lyrics-search';
// import {lyrics_search, LyricsSearch, Response} from '@penfoldium/lyrics-search';

    const GeniusLyrics = new lyrics_search('wf0YEb87VW5a72NjaFOw4x7x7gPY_RNbosf90Z9C-KknZY6VaV2LUi5ZLRjj2BTU');

    export async function parseLyrics(bot: TelegramBot, message: Message, link: string) {
        try {
            const spotifyDescription = await grabSpotifySongDescription(link);
            const geniusSearchQuery = extractSongInfo(spotifyDescription);
            const geniusSearchResult = await GeniusLyrics.search(geniusSearchQuery);
            const lyrics = await grabGeniusLyrics(geniusSearchResult.url)

            console.dir(lyrics);
            console.dir(geniusSearchResult);

            await bot.sendMessage(message.chat.id, lyrics || geniusSearchResult.title || 'NULL')
            messagesLogger.info({message, result: geniusSearchResult});
        } catch (e) {
            console.error(e);
        }
    }

