const chalk = require('chalk');
const grabity = require('grabity');
const cheerio = require("cheerio");
const fetch = require("node-fetch");

exports.getLink = (message) => {
    const url = RegExp('http(s):\/\/(open\.spotify\.com|music\.youtube\.com)(.*?)([ ]|$)')
    let execArray = url.exec(message);
    return execArray ? execArray[0] : null;
}

exports.grabSongTitle = async (url) => {
    const spotifyMetaData = await grabity.grabIt(url);
    console.log(chalk.bold.blue('Description: ', spotifyMetaData.description));
    return encodeURI(spotifyMetaData.title)
}

exports.grabSongDescription = (url) => {
    const spotifyMetaData = grabity.grabIt(url);
    return spotifyMetaData
}

// You got song description on following format:
// ${songName} (feat. ${featArtist}), a song by ${artist}, ${featArtist} on Spotify
exports.extractSongInfo = (description) => {
    const [title, artists] = description.replace(' on Spotify', '').split(', a song by ')

    let leftoverPosition = title.indexOf(' (')
    if(leftoverPosition === -1) {
        leftoverPosition = title.indexOf(' - Prod')
    }

    const name = leftoverPosition === -1 ? title : title.slice(0, leftoverPosition)
    const artist = artists.split(',')[0]

    return `${artist} ${name}`
}

exports.grabLyrics = async (url) => {
    let res = await fetch(url);
    if (res.status !== 200) throw 'Something went wrong';

    res = await res.text();

    const $ = cheerio.load(res);
    const a = $('.lyrics')
    let b = a.text();
    return b.trim();
}
