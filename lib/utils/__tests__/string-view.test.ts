import { describe, expect, test } from 'bun:test';
import { StringView, isDigit, isWhitespace } from '@lib/utils/string-view';

describe('@lib/utils/string-view', () => {
    describe('StringView', () => {
        test('should be instantiable', () => {
            expect(new StringView('')).toBeInstanceOf(StringView);
        });

        test('should be instantiable with string', () => {
            expect(new StringView('test').toString()).toBe('test');
        });

        test('should be instantiable with string view', () => {
            expect(StringView.fromStringView(new StringView('test')).toString()).toBe('test');
        });

        test('charAt', () => {
            expect(new StringView('test').charAt(0)).toBe('t');
        });

        test('indexOf', () => {
            expect(new StringView('test').indexOf('es')).toBe(1);
        });

        test('eq', () => {
            expect(new StringView('test').eq(new StringView('test'))).toBe(true);
        });

        test('eqIgnoreCase', () => {
            expect(new StringView('test').eqIgnoreCase(new StringView('TEST'))).toBe(true);
        });

        test('startsWith', () => {
            expect(new StringView('test').startsWith(new StringView('te'))).toBe(true);
        });

        test('endsWith', () => {
            expect(new StringView('test').endsWith(new StringView('st'))).toBe(true);
        });

        test('toString', () => {
            expect(new StringView('test').toString()).toBe('test');
        });

        test('trimLeft', () => {
            expect(new StringView('\n\t\r  test').trimLeft().toString()).toBe('test');
        });

        test('trimRight', () => {
            expect(new StringView('test  \t\n\r').trimRight().toString()).toBe('test');
        });

        test('trim', () => {
            expect(new StringView('\n\r\t  test  \t\r\n').trim().toString()).toBe('test');
        });

        test('takeLeftWhile', () => {
            const sv = new StringView('1234test');
            expect(
                sv
                    .takeLeftWhile(char => isDigit(char))
                    .toString()
            ).toBe('1234');
            expect(sv.toString()).toBe('1234test');
        });

        describe('chopLeft', () => {
            test('should chop left', () => {
                const sv = new StringView('1234test');
                expect(sv.chopLeft(4).toString()).toBe('1234');
                expect(sv.toString()).toBe('test');
            });

            test('should chop left with size > length', () => {
                const sv = new StringView('1234test');
                expect(sv.chopLeft(100).toString()).toBe('1234test');
                expect(sv.toString()).toBe('');
            });
        });

        describe('chopRight', () => {
            test('should chop right', () => {
                const sv = new StringView('1234test');
                expect(sv.chopRight(4).toString()).toBe('test');
                expect(sv.toString()).toBe('1234');
            });

            test('should chop right with size > length', () => {
                const sv = new StringView('1234test');
                expect(sv.chopRight(100).toString()).toBe('1234test');
                expect(sv.toString()).toBe('');
            });
        });

        test('tryChopByDelimiter', () => {
            const sv = new StringView('1234 test');
            const result = sv.tryChopByDelimiter(' ');
            expect(result.success).toBe(true);
            expect(sv.toString()).toBe('test');
            expect(result.data?.toString()).toBe('1234');

            const sv2 = new StringView('1234test');
            const result2 = sv2.tryChopByDelimiter(' ');
            expect(result2.success).toBe(false);
            expect(sv2.toString()).toBe('1234test');
            expect(result2.data).toBeUndefined();
        });

        test('chopByDelimiter', () => {
            const sv = new StringView('1234 test');
            const result = sv.chopByDelimiter(' ');
            expect(sv.toString()).toBe('test');
            expect(result.toString()).toBe('1234');

            const sv2 = new StringView('1234test');
            const result2 = sv2.chopByDelimiter(' ');
            expect(sv2.toString()).toBe('');
            expect(result2.toString()).toBe('1234test');
        });

        test('chopByStringView', () => {
            const delim = new StringView('  ');
            const sv = new StringView('1234  test');
            const result = sv.chopByStringView(delim);
            expect(sv.toString()).toBe('test');
            expect(result.toString()).toBe('1234');
            expect(delim.toString()).toBe('  ');

            const sv2 = new StringView('1234test');
            const result2 = sv2.chopByStringView(delim);
            expect(sv2.toString()).toBe('');
            expect(result2.toString()).toBe('1234test');
            expect(delim.toString()).toBe('  ');
        });

        test('toInt', () => {
            expect(new StringView('1234test').toInt()).toBe(1234);
            expect(new StringView('-1234foo').toInt()).toBe(-1234);
        });

        test('toFloat', () => {
            expect(new StringView('1234.56test').toFloat()).toBe(1234.56);
            expect(new StringView('-1234.56foo').toFloat()).toBe(-1234.56);
        });

        test('chopInt', () => {
            const sv = new StringView('1234test');
            expect(sv.chopInt()).toBe(1234);
            expect(sv.toString()).toBe('test');

            const sv2 = new StringView('-1234foo');
            expect(sv2.chopInt()).toBe(-1234);
            expect(sv2.toString()).toBe('foo');
        });

        test('chopFloat', () => {
            const sv = new StringView('1234.56test');
            expect(sv.chopFloat()).toBe(1234.56);
            expect(sv.toString()).toBe('test');

            const sv2 = new StringView('-1234.56foo');
            expect(sv2.chopFloat()).toBe(-1234.56);
            expect(sv2.toString()).toBe('foo');
        });

        test('chopLeftWhile', () => {
            const sv = new StringView('1234test');
            expect(
                sv
                    .chopLeftWhile(char => isDigit(char))
                    .toString()
            ).toBe('1234');
            expect(sv.toString()).toBe('test');
        });

        test('example compound use', () => {
            const data = '           1 2 3 4 5 6 7 8 9 10        ';
            const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

            const sv = new StringView(data).trim();
            const result = sv.toString()
                .split(/\s+/)
                .map(Number);

            expect(result).toEqual(expected);
        });

        test('original text is not modified', () => {
            const sv = new StringView('1234 test');
            const result = sv.chopByDelimiter(' ');
            expect(sv.source).toBe('1234 test');
            expect(sv.source === result.source).toBe(true);
        });

        test('should support iteration', () => {
            const sv = new StringView('test');
            expect([...sv]).toEqual(['t', 'e', 's', 't']);
        });

        test('should support for...of loop', () => {
            const sv = new StringView('test');
            const chars: string[] = [];
            for (const char of sv) {
                chars.push(char);
            }
            expect(chars).toEqual(['t', 'e', 's', 't']);
        });

        test('empty string handling', () => {
            const empty = new StringView('');
            expect(empty.size).toBe(0);
            expect(empty.toString()).toBe('');
            expect([...empty]).toEqual([]);
            expect(empty.trim().toString()).toBe('');
            expect(empty.chopLeft(1).toString()).toBe('');
            expect(empty.chopRight(1).toString()).toBe('');
        });

        test('unicode character handling', () => {
            const unicode = new StringView('Hello 👋 世界');
            expect(unicode.size).toBe(10);
            expect([...unicode]).toHaveLength(10);
            expect(unicode.charAt(6)).toBe('👋');
        });

        test('number parsing edge cases', () => {
            expect(new StringView('').toInt()).toBe(0);
            expect(new StringView('abc').toInt()).toBe(0);
            expect(new StringView('123abc456').toInt()).toBe(123);
            expect(new StringView('-0').toInt()).toBe(0);
            expect(new StringView('+0').toInt()).toBe(0);
            expect(new StringView('+-123').toInt()).toBe(0);
        });

        test('float parsing edge cases', () => {
            expect(new StringView('').toFloat()).toBe(0);
            expect(new StringView('.').toFloat()).toBe(0);
            expect(new StringView('abc').toFloat()).toBe(0);
            expect(new StringView('123.abc').toFloat()).toBe(123);
            expect(new StringView('123.456.789').toFloat()).toBe(123.456);
            expect(new StringView('-0.0').toFloat()).toBe(0);
            expect(new StringView('+.123').toFloat()).toBe(0.123);
        });

        test('delimiter edge cases', () => {
            const sv = new StringView('test||test||');
            
            // Multiple consecutive delimiters
            expect(sv.chopByDelimiter('||').toString()).toBe('test');
            expect(sv.toString()).toBe('test||');

            // Empty sections between delimiters
            const empty = new StringView('||');
            expect(empty.chopByDelimiter('|').toString()).toBe('');
            expect(empty.toString()).toBe('|');
        });

        test('whitespace edge cases', () => {
            // Mixed whitespace characters
            const mixed = new StringView('\r\n\t \f\v');
            expect(mixed.trim().toString()).toBe('');

            // Non-breaking spaces and other special whitespace
            const special = new StringView('\u00A0\u2003test\u00A0\u2003');
            expect(special.trim().toString()).toBe('test');
        });

        test('method chaining with empty results', () => {
            const sv = new StringView('   ');
            expect(sv.trim().chopLeft(1).toString()).toBe('');
            expect(sv.trim().chopRight(1).toString()).toBe('');
        });

        test('bounds checking', () => {
            const sv = new StringView('test');
            expect(sv.charAt(-1)).toBe('');
            expect(sv.charAt(4)).toBe('');
            expect(sv.chopLeft(-1).toString()).toBe('');
            expect(sv.chopRight(-1).toString()).toBe('');
        });

        test('large string handling', () => {
            const largeString = 'a'.repeat(1000000);
            const sv = new StringView(largeString);
            expect(sv.size).toBe(1000000);
            expect(sv.charAt(999999)).toBe('a');
        });

        test('mutation independence', () => {
            const original = 'test string';
            const sv1 = new StringView(original);
            const sv2 = StringView.fromStringView(sv1);
            
            sv1.chopLeft(5);
            expect(sv1.toString()).toBe('string');
            expect(sv2.toString()).toBe('test string');
        });
    });

    describe('isWhitespace', () => {
        test('should return true for whitespace', () => {
            expect(isWhitespace(' ')).toBe(true);
            expect(isWhitespace('\t')).toBe(true);
            expect(isWhitespace('\n')).toBe(true);
            expect(isWhitespace('\r')).toBe(true);
        });

        test('should return false for non-whitespace', () => {
            expect(isWhitespace('a')).toBe(false);
            expect(isWhitespace('1')).toBe(false);
            expect(isWhitespace('')).toBe(false);
        });

        test('should return false for undefined', () => {
            expect(isWhitespace(undefined)).toBe(false);
        });

        test('should handle null', () => {
            expect(isWhitespace(null)).toBe(false);
        });
    });

    describe('isDigit', () => {
        test('should return true for digits', () => {
            expect(isDigit('0')).toBe(true);
            expect(isDigit('1')).toBe(true);
            expect(isDigit('2')).toBe(true);
            expect(isDigit('3')).toBe(true);
            expect(isDigit('4')).toBe(true);
            expect(isDigit('5')).toBe(true);
            expect(isDigit('6')).toBe(true);
            expect(isDigit('7')).toBe(true);
            expect(isDigit('8')).toBe(true);
            expect(isDigit('9')).toBe(true);
        });

        test('should return false for non-digits', () => {
            expect(isDigit('a')).toBe(false);
            expect(isDigit(' ')).toBe(false);
            expect(isDigit('')).toBe(false);
        });

        test('should return false for undefined', () => {
            expect(isDigit(undefined)).toBe(false);
        });

        test('should handle null', () => {
            expect(isDigit(null)).toBe(false);
        });
    });
});
