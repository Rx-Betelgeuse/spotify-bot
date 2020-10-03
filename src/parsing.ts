import * as cheerio from "cheerio";
import * as chalk from "chalk";
import fetch from "node-fetch";
import {grabIt} from "grabity";
import { Message } from "node-telegram-bot-api";

export const containsLink = (message: Message) => {
    const url = RegExp('http(s):\/\/(open\.spotify\.com|music\.youtube\.com)(.*?)([ ]|$)')
    let execArray = url.exec(message.text||'');
    return execArray ? execArray[0] : null;
}

export const grabSongTitle = async (url: string) => {
    const spotifyMetaData = await grabIt(url);
    console.log(chalk.bold.blue('Description: ', spotifyMetaData.description));
    return encodeURI(spotifyMetaData.title)
}

export const grabSpotifySongDescription = async (url: string) => {
    const spotifyMetaData = await grabIt(url);
    return spotifyMetaData.description
}

// You got song description on following format:
// ${songName} (feat. ${featArtist}), a song by ${artist}, ${featArtist} on Spotify
export const extractSongInfo = (description: string) => {
    const [title, artists] = description.replace(' on Spotify', '').split(', a song by ')

    let leftoverPosition = title.indexOf(' (')
    if(leftoverPosition === -1) {
        leftoverPosition = title.indexOf(' - Prod')
    }

    const name = leftoverPosition === -1 ? title : title.slice(0, leftoverPosition)
    const artist = artists.split(',')[0]

    return encodeURI(`${artist} ${name}`)
}

export const grabGeniusLyrics = async (geniusSongUrl: string) => {
    const response = await fetch(geniusSongUrl);
    if (response.status !== 200) throw 'Something went wrong';

    const result = await response.text();

    const $ = cheerio.load(result);
    const a = $('.lyrics')
    let b = a.text();
    return b.trim();
}
