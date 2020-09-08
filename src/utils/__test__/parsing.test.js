const parsing = require('../parsing');


test('extractSongInfo', () => {
    const description = `Hot Wheels (feat. Hot Sugar), a song by Boulevard Depo, Hot Sugar on Spotify`;
    const a = parsing.extractSongInfo(description)
    expect(a).toBe('Boulevard Depo Hot Wheels');
    // expect(a).toBe('Boulevard Depo Hot Wheels');
});

test('extractSongInfo', () => {
    const description = `DRUГ - Prod. by Airblade, a song by Boulevard Depo on Spotify`;
    const a = parsing.extractSongInfo(description)
    expect(a).toBe('Boulevard Depo DRUГ');
    // expect(a).toBe('Boulevard Depo Hot Wheels');
});

test('extractSongInfo', () => {
    const description = `MOONWORK (feat. Basic Boy) - Prod. SP4K, a song by Boulevard Depo, Basic Boy on Spotify`;
    const a = parsing.extractSongInfo(description)
    expect(a).toBe('Boulevard Depo MOONWORK');
});

test('extractSongInfo', () => {
    const description = `Otritsala (feat. Cold$iemens), a song by Boulevard Depo, Cold$iemens on Spotify`;
    const a = parsing.extractSongInfo(description)
    expect(a).toBe('Boulevard Depo Otritsala');
});


describe('parsing.getLink', () => {
    describe('match url', () => {
        test('spotify', () => {
            const link = `https://open.spotify.com/track/0fCu8IqeqqahCbgOyYKAeh?si=MqKy5qw3T-OUIrDM6hJvcQ`;
            const a = parsing.getLink(link)
            expect(a).toBe('https://open.spotify.com/track/0fCu8IqeqqahCbgOyYKAeh?si=MqKy5qw3T-OUIrDM6hJvcQ');
        });

        test('spotify with text', () => {
            const link = `Рекомендую этот трек: Пофигу Би-2
https://open.spotify.com/track/0fCu8IqeqqahCbgOyYKAeh?si=MqKy5qw3T-OUIrDM6hJvcQ`;
            const a = parsing.getLink(link)
            expect(a).toBe('https://open.spotify.com/track/0fCu8IqeqqahCbgOyYKAeh?si=MqKy5qw3T-OUIrDM6hJvcQ');
        });

        test('youtube', () => {
            const link = `https://music.youtube.com/watch?v=a6AW36zEfjo&feature=share`;
            const a = parsing.getLink(link)
            expect(a).toBe('https://music.youtube.com/watch?v=a6AW36zEfjo&feature=share');
        });

        test('text without link', () => {
            const link = `no link`;
            const a = parsing.getLink(link)
            expect(a).toBe(null);
        });
    })
})
