import * as cheerio from 'cheerio';
import { grabIt } from 'grabity';
import { Message } from 'node-telegram-bot-api';
import { from, of } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
import fetch from 'node-fetch'

export const containsLink = (message: Message) => {
  const url = RegExp(
      'http(s)://(open.spotify.com/track/|music.youtube.com)(.*?)([ ]|$)',
  );
  const execArray = url.exec(message.text || '');
  return execArray ? execArray[0] : null;
};

export const grabSongInfo = (url: string) => {
  return from(grabIt(url)).pipe(
      map((spotifyMetaData) =>{ 
        return {
        title: spotifyMetaData.title,
        description:extractSongInfo( spotifyMetaData.description)}
      }),
  );
};

// You got song description on following format:
// ${songName} (feat. ${featArtist}), a song by ${artist}, ${featArtist} on Spotify
export const extractSongInfo = (description: string) => {
  const [title, artists] = description
      .replace(' on Spotify', '')
      .split(', a song by ');

  let leftoverPosition = title.indexOf(' (');
  if (leftoverPosition === -1) {
    leftoverPosition = title.indexOf(' - Prod');
  }

  const name =
    leftoverPosition === -1 ? title : title.slice(0, leftoverPosition);
  const artist = artists.split(',')[0];
  return encodeURI(`${artist} ${name}`);
};

export const grabGeniusLyrics = (geniusSongUrl: string) => {
  return  from(fetch(geniusSongUrl)).pipe(
      switchMap((response) => {
        if (response.status !== 200)  return of(new Error( `Error ${response.status}` ));
        else {
          return from(response.buffer());
        }
      }),
      filter((result: Buffer | Error): result is Buffer => (<Buffer>result) !== undefined),
      map((result) => {
        const $ = cheerio.load(result);
        const a = $('.lyrics');
        const b = a.text();
        if(b && b.length)
        return b.trim()
        else throw(new Error( `Null lyrics` ))
      })
  );
};
