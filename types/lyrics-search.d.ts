declare module '@penfoldium/lyrics-search' {
    interface Response {

        new(lyrics: string, result: object): Response;

        lyrics: string;
        annotationCount: number;
        fullTitle: string;
        headerThumbnail: string;
        header: string;
        id: number;
        lyricsOwnerID: number;
        pyongs: number;
        songArtImageThumbnail: string;
        songArtImage: string;
        stats: {
            unreviewedAnnotations: number,
            hot: boolean,
            pageviews: number
        }
        title: string;
        titleWithFeatured: string;
        url: string;
        primaryArtist: {
            header: string,
            id: number,
            image: string,
            memeVerified: boolean,
            verified: boolean,
            name: string,
            url: string,
            iq: number
        }
    }

    const lyrics_search: LyricsSearch;

    interface LyricsSearch {
        new(url: string): LyricsSearch;

        search: (text: string) => Promise<Response>
        _search: (query: string) => Promise<Response>;
        _scrape: (url: string) => string;


    }

    export = lyrics_search
    // {lyrics_search, Response , LyricsSearch  } ;
}














