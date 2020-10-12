import * as lyrics_search from '@penfoldium/lyrics-search';
import { from } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';

import { grabGeniusLyrics, grabSongInfo } from './parsing';

const GeniusLyrics = new lyrics_search(
  'wf0YEb87VW5a72NjaFOw4x7x7gPY_RNbosf90Z9C-KknZY6VaV2LUi5ZLRjj2BTU',
);

export function parseLyrics(url: string) {
  return grabSongInfo(url).pipe(
        switchMap((spotifyInfo) => from(GeniusLyrics.search(spotifyInfo.description)).pipe(
        pluck('url'),
        switchMap( grabGeniusLyrics ),
        map(lyrics => lyrics || spotifyInfo.title))))
}
