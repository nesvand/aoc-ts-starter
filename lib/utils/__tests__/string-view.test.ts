import { StringView, isWhitespace, isDigit } from '@lib/utils/string-view';

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
            expect(sv.takeLeftWhile((char) => typeof char !== 'undefined' && ['1', '2', '3', '4'].includes(char)).toString()).toBe('1234');
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
            expect(sv.chopLeftWhile((char) => typeof char !== 'undefined' && ['1', '2', '3', '4'].includes(char)).toString()).toBe('1234');
            expect(sv.toString()).toBe('test');
        });

        test('example compound use', () => {
            const data = '           1 2 3 4 5 6 7 8 9 10        ';
            const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

            const sv = new StringView(data);
            const result: number[] = [];
            sv.chopLeftWhile(isWhitespace);
            while (sv.size > 0) {
                result.push(sv.chopInt());
                sv.chopLeftWhile(isWhitespace);
            }

            expect(result).toEqual(expected);
            expect(sv.toString()).toBe('');
        });

        test('original text is not modified', () => {
            const sv = new StringView('1234 test');
            const result = sv.chopByDelimiter(' ');
            expect(sv._source.data).toBe('1234 test');
            expect(sv._source === result._source).toBe(true);
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
    });
});
