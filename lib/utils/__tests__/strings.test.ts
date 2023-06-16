import { extract, int, word, float } from '@lib/utils/strings';
import { StringView } from '@lib/utils/string-view';

describe('@lib/utils/strings', () => {
    describe('extract', () => {
        test('should extract values from a string', () => {
            const input = 'Hello 123 World';
            const result = extract`Hello ${int} World`(new StringView(input));
            expect(result).toEqual([123]);
        });

        test('should extract multiple values from a string', () => {
            const input = 'Hello 123 World 456';
            const result = extract`Hello ${int} World ${int}`(new StringView(input));
            expect(result).toEqual([123, 456]);
        });

        test('should extract multiple values from a string with a float', () => {
            const input = 'Hello 123 World 456.789';
            const result = extract`Hello ${int} World ${float}`(new StringView(input));
            expect(result).toEqual([123, 456.789]);
        });

        test('should extract multiple values from a string with a word', () => {
            const input = 'Hello 123 World 456.789';
            const result = extract`Hello ${int} World ${word}`(new StringView(input));
            expect(result).toEqual([123, '456.789']);
        });

        test('should extract multiple values from a string with a word and a float', () => {
            const input = 'Hello 123 World Foo 456.789';
            const result = extract`Hello ${int} World ${word} ${float}`(new StringView(input));
            expect(result).toEqual([123, 'Foo', 456.789]);
        });
    });
});
