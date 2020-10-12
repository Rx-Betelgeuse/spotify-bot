import * as dotenv from 'dotenv';
import * as TelegramBot from 'node-telegram-bot-api';
import { Message } from 'node-telegram-bot-api';
import { from, of, Subject } from 'rxjs';
import { catchError, filter, map, retry, switchMap, tap } from 'rxjs/operators';

import { parseLyrics } from './actions';
import { messagesLogger } from './logger';

dotenv.config({ path: __dirname + '/.env' });

const bot = new TelegramBot('1248216668:AAGqvoMHpu3GFmiDMm_i7bXRiN3nfOndWrM', {
  polling: true,
});

const url = RegExp(
  'http(s)://(link.tospotify.com|open.spotify.com\/track\/|music.youtube.com)(.*?)([ ]|$)',
);

const messagesStream = new Subject<{ message: Message, match: string }>();

messagesStream.pipe(
  filter(({ match }) => !!match),
  switchMap(({ message, match }) => parseLyrics(match)
    .pipe(retry(5), map(lyrics => { return {  message, lyrics } }))),    
  catchError(error => { console.log('error', error); return of(error) }),
  switchMap(({ message, lyrics }) => from(
    bot.sendMessage(
      message?.chat?.id,
      lyrics
    ),
  )),
  tap((info) => messagesLogger.info(info)),
).subscribe(() => { })

bot.onText(
  url,
  (message, match) => messagesStream.next({ message, match: match ? match[0] : '' })  
);
