import { describe, expect, test } from 'bun:test';
import { StringView, isDigit, isWhitespace } from '@lib/string-view';

describe('@lib/utils/string-view', () => {
    describe('StringView', () => {
        describe('initialization', () => {
            test('should be instantiable with empty string', () => {
                expect(new StringView('')).toBeInstanceOf(StringView);
            });

            test('should be instantiable with string', () => {
                expect(new StringView('test').toString()).toBe('test');
            });

            test('should be instantiable with string view', () => {
                expect(StringView.fromStringView(new StringView('test')).toString()).toBe('test');
            });
        });

        describe('basic operations', () => {
            test('charAt', () => {
                const sv = new StringView('test');
                expect(sv.charAt(0)).toBe('t');
                expect(sv.charAt(-1)).toBe('');
                expect(sv.charAt(4)).toBe('');
            });

            test('indexOf', () => {
                expect(new StringView('test').indexOf('es')).toBe(1);
            });

            test('toString', () => {
                expect(new StringView('test').toString()).toBe('test');
            });

            test('iteration', () => {
                const sv = new StringView('test');
                expect([...sv]).toEqual(['t', 'e', 's', 't']);

                const chars: string[] = [];
                for (const char of sv) {
                    chars.push(char);
                }
                expect(chars).toEqual(['t', 'e', 's', 't']);
            });
        });

        describe('comparison operations', () => {
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
        });

        describe('whitespace handling', () => {
            test('trimLeft', () => {
                expect(new StringView('\n\t\r  test').trimLeft().toString()).toBe('test');
            });

            test('trimRight', () => {
                expect(new StringView('test  \t\n\r').trimRight().toString()).toBe('test');
            });

            test('trim', () => {
                expect(new StringView('\n\r\t  test  \t\r\n').trim().toString()).toBe('test');
            });

            test('unicode whitespace', () => {
                const str = new StringView('\u2003Hello\u200A\u{1F44B}\u2002\u4E16\u754C\u2001');
                expect(str.trim().toString()).toBe('Hello\u200A\u{1F44B}\u2002\u4E16\u754C');
            });
        });

        describe('chopping operations', () => {
            describe('chopLeft', () => {
                test('edge cases', () => {
                    const sv = new StringView('1234test');
                    expect(sv.chopLeft(-1).toString()).toBe('');
                    expect(sv.toString()).toBe('1234test');

                    const sv2 = new StringView('1234test');
                    expect(sv2.chopLeft(0).toString()).toBe('');
                    expect(sv2.toString()).toBe('1234test');

                    const sv3 = new StringView('1234test');
                    expect(sv3.chopLeft(8).toString()).toBe('1234test');
                    expect(sv3.toString()).toBe('');

                    const sv4 = new StringView('1234test');
                    expect(sv4.chopLeft(100).toString()).toBe('1234test');
                    expect(sv4.toString()).toBe('');
                });

                test('with predicate', () => {
                    const sv = new StringView('1234test');
                    expect(sv.chopLeftWhile((char) => isDigit(char)).toString()).toBe('1234');
                    expect(sv.toString()).toBe('test');
                });
            });

            describe('chopRight', () => {
                test('edge cases', () => {
                    const sv1 = new StringView('1234test');
                    expect(sv1.chopRight(-1).toString()).toBe('');
                    expect(sv1.toString()).toBe('1234test');

                    const sv2 = new StringView('1234test');
                    expect(sv2.chopRight(0).toString()).toBe('');
                    expect(sv2.toString()).toBe('1234test');

                    const sv3 = new StringView('1234test');
                    expect(sv3.chopRight(8).toString()).toBe('1234test');
                    expect(sv3.toString()).toBe('');

                    const sv4 = new StringView('1234test');
                    expect(sv4.chopRight(100).toString()).toBe('1234test');
                    expect(sv4.toString()).toBe('');
                });
            });

            describe('chopByDelimiter', () => {
                test('basic delimiter handling', () => {
                    const sv = new StringView('test||test||');
                    expect(sv.chopByDelimiter('||').toString()).toBe('test');
                    expect(sv.toString()).toBe('test||');
                });

                test('unicode delimiter handling', () => {
                    const str = new StringView('Hello👋World');
                    const result = str.chopByDelimiter('👋');
                    expect(result.toString()).toBe('Hello');
                    expect(str.toString()).toBe('World');

                    const str2 = new StringView('Hello👋World👋Test');
                    expect(str2.chopByDelimiter('👋').toString()).toBe('Hello');
                    expect(str2.toString()).toBe('World👋Test');
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
            });
        });

        describe('number parsing', () => {
            test('integer parsing', () => {
                expect(new StringView('1234test').toInt()).toBe(1234);
                expect(new StringView('-1234foo').toInt()).toBe(-1234);
                expect(new StringView('').toInt()).toBe(0);
                expect(new StringView('abc').toInt()).toBe(0);
                expect(new StringView('-0').toInt()).toBe(-0);
                expect(new StringView('+0').toInt()).toBe(0);
                expect(new StringView('+-123').toInt()).toBe(0);
            });

            test('float parsing', () => {
                expect(new StringView('').toFloat()).toBe(0);
                expect(new StringView('.').toFloat()).toBe(0);
                expect(new StringView('abc').toFloat()).toBe(0);
                expect(new StringView('123.abc').toFloat()).toBeCloseTo(123);
                expect(new StringView('123.456.789').toFloat()).toBeCloseTo(123.456);
                expect(new StringView('-0.0').toFloat()).toBe(-0);
                expect(new StringView('+.123').toFloat()).toBeCloseTo(0.123);
                expect(new StringView('123.456').toFloat()).toBeCloseTo(123.456);
                expect(new StringView('-123.456').toFloat()).toBeCloseTo(-123.456);
                expect(new StringView('0.456').toFloat()).toBeCloseTo(0.456);
            });
        });

        describe('unicode handling', () => {
            test('basic unicode characters', () => {
                const unicode = new StringView('Hello 👋 世界');
                expect(unicode.size).toBe(11);
                expect([...unicode]).toHaveLength(10);
                expect(unicode.charAt(6)).toBe('👋');
            });

            test('complex emoji sequences', () => {
                const emoji = new StringView('👨‍👩‍👧‍👦 👨🏻‍💻 🏳️‍🌈');
                expect(emoji.charAt(0)).toBe('👨‍👩‍👧‍👦');
                expect(emoji.charAt(1)).toBe(' ');
                expect(emoji.charAt(2)).toBe('👨🏻‍💻');
                expect(emoji.charAt(3)).toBe(' ');
                expect(emoji.charAt(4)).toBe('🏳️‍🌈');
            });

            test('combining characters', () => {
                const str = new StringView('e\u0301');
                expect(str.size).toBe(2);
                expect(str.charAt(0).normalize('NFC')).toBe('é');
                expect(str.charAt(1)).toBe('');
            });
        });

        describe('number chopping', () => {
            describe('chopInt', () => {
                test('basic integer chopping', () => {
                    const sv = new StringView('123abc');
                    const result = sv.chopInt();
                    expect(result.success).toBe(true);
                    expect(result.data).toBe(123);
                    expect(sv.toString()).toBe('abc');
                });

                test('signed integers', () => {
                    const sv1 = new StringView('-123abc');
                    const result1 = sv1.chopInt();
                    expect(result1.success).toBe(true);
                    expect(result1.data).toBe(-123);
                    expect(sv1.toString()).toBe('abc');

                    const sv2 = new StringView('+456def');
                    const result2 = sv2.chopInt();
                    expect(result2.success).toBe(true);
                    expect(result2.data).toBe(456);
                    expect(sv2.toString()).toBe('def');
                });

                test('invalid integers', () => {
                    const cases = [
                        '', // empty string
                        'abc', // no digits
                        '-abc', // sign only
                        '+abc', // sign only
                        '+-123', // invalid sign
                        '--123', // multiple signs
                        '++123', // multiple signs
                    ];

                    for (const testCase of cases) {
                        const sv = new StringView(testCase);
                        const result = sv.chopInt();
                        expect(result.success).toBe(false);
                        expect(result.data).toBeUndefined();
                        expect(sv.toString()).toBe(testCase);
                    }
                });

                test('sequential integer chopping', () => {
                    const sv = new StringView('123 456 789');

                    const result1 = sv.chopInt();
                    expect(result1.success).toBe(true);
                    expect(result1.data).toBe(123);
                    sv.trimLeft();

                    const result2 = sv.chopInt();
                    expect(result2.success).toBe(true);
                    expect(result2.data).toBe(456);
                    sv.trimLeft();

                    const result3 = sv.chopInt();
                    expect(result3.success).toBe(true);
                    expect(result3.data).toBe(789);
                    expect(sv.toString()).toBe('');
                });
            });

            describe('chopFloat', () => {
                test('basic float chopping', () => {
                    const sv = new StringView('123.456abc');
                    const result = sv.chopFloat();
                    expect(result.success).toBe(true);
                    expect(result.data).toBeCloseTo(123.456);
                    expect(sv.toString()).toBe('abc');
                });

                test('signed floats', () => {
                    const sv1 = new StringView('-123.456abc');
                    const result1 = sv1.chopFloat();
                    expect(result1.success).toBe(true);
                    expect(result1.data).toBeCloseTo(-123.456);
                    expect(sv1.toString()).toBe('abc');

                    const sv2 = new StringView('+456.789def');
                    const result2 = sv2.chopFloat();
                    expect(result2.success).toBe(true);
                    expect(result2.data).toBeCloseTo(456.789);
                    expect(sv2.toString()).toBe('def');
                });

                test('partial floats', () => {
                    const cases = [
                        { input: '123.', expected: 123 },
                        { input: '.456', expected: 0.456 },
                        { input: '+.456', expected: 0.456 },
                        { input: '-.456', expected: -0.456 },
                        { input: '123.abc', expected: 123 },
                    ];

                    for (const { input, expected } of cases) {
                        const sv = new StringView(input);
                        const result = sv.chopFloat();
                        expect(result.success).toBe(true);
                        expect(result.data).toBeCloseTo(expected);
                    }
                });

                test('invalid floats', () => {
                    const cases = [
                        '', // empty string
                        'abc', // no digits
                        '-abc', // sign only
                        '+abc', // sign only
                        '+-123.456', // invalid sign
                        '--123.456', // multiple signs
                        '++123.456', // multiple signs
                        '.', // decimal point only
                        '+.', // sign and decimal only
                        '-.', // sign and decimal only
                    ];

                    for (const testCase of cases) {
                        const sv = new StringView(testCase);
                        const result = sv.chopFloat();
                        expect(result.success).toBe(false);
                        expect(result.data).toBeUndefined();
                        expect(sv.toString()).toBe(testCase);
                    }
                });

                test('sequential float chopping', () => {
                    const sv = new StringView('123.45 -456.78 +789.01');

                    const result1 = sv.chopFloat();
                    expect(result1.success).toBe(true);
                    expect(result1.data).toBeCloseTo(123.45);
                    sv.trimLeft();

                    const result2 = sv.chopFloat();
                    expect(result2.success).toBe(true);
                    expect(result2.data).toBeCloseTo(-456.78);
                    sv.trimLeft();

                    const result3 = sv.chopFloat();
                    expect(result3.success).toBe(true);
                    expect(result3.data).toBeCloseTo(789.01);
                    expect(sv.toString()).toBe('');
                });
            });
        });
    });

    describe('utility functions', () => {
        describe('isWhitespace', () => {
            test('should handle various inputs', () => {
                expect(isWhitespace(' ')).toBe(true);
                expect(isWhitespace('\t')).toBe(true);
                expect(isWhitespace('\n')).toBe(true);
                expect(isWhitespace('\r')).toBe(true);
                expect(isWhitespace('a')).toBe(false);
                expect(isWhitespace('')).toBe(false);
                expect(isWhitespace(undefined)).toBe(false);
                // biome-ignore lint/suspicious/noExplicitAny: Any is used to test null
                expect(isWhitespace(null as any)).toBe(false);
            });
        });

        describe('isDigit', () => {
            test('should handle various inputs', () => {
                for (let i = 0; i <= 9; i++) {
                    expect(isDigit(i.toString())).toBe(true);
                }
                expect(isDigit('a')).toBe(false);
                expect(isDigit(' ')).toBe(false);
                expect(isDigit('')).toBe(false);
                expect(isDigit(undefined)).toBe(false);
                // biome-ignore lint/suspicious/noExplicitAny: Any is used to test null
                expect(isDigit(null as any)).toBe(false);
            });
        });
    });
});
