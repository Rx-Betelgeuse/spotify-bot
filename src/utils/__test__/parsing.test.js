const parsing = require('../parsing');

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
