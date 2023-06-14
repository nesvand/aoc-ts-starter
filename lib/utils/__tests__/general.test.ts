import { asyncTimes, invert, isDefined, mapGetOrCreate, times, wait } from '@lib/utils/general';

describe('@lib/utils/general', () => {
    describe('isDefined', () => {
        test('only considers `undefined` and `null` to be false', () => {
            const vals = [undefined, null, '', 0, false, true, 'test', 1, {}, []];
            const expected = [false, false, true, true, true, true, true, true, true, true];
            const actual = vals.map((val) => isDefined(val));
            expect(actual).toEqual(expected);
        });
    });

    describe('wait', () => {
        test('waits for the specified amount of time', async () => {
            const startTime = Date.now();
            await wait(1000);
            const endTime = Date.now();
            expect(endTime - startTime).toBeGreaterThanOrEqual(1000);
        });
    });

    describe('times', () => {
        test('calls the function the specified number of times', () => {
            const fn = jest.fn();
            const results = times(5, fn);
            expect(fn).toHaveBeenCalledTimes(5);
            expect(results.length).toBe(5);
        });
    });

    describe('asyncTimes', () => {
        test('calls the function the specified number of times', async () => {
            const fn = jest.fn();
            const mockFn = async () => {
                await wait(100);
                fn();
            };
            const results = await asyncTimes(5, mockFn);
            expect(fn).toHaveBeenCalledTimes(5);
            expect(results.length).toBe(5);
        });
    });

    describe('mapGetOrCreate', () => {
        test('should not throw an error on falsy values', () => {
            const map = new Map<string, unknown>();
            const expected = [0, false, null, '', NaN];
            const actual = ['test', 'test2', 'test3', 'test4', 'test5'].map((key, i) => mapGetOrCreate(map, key, () => expected[i]));
            expect(actual).toEqual(expected);
        });

        test('should throw an error if the value is undefined', () => {
            const map = new Map<string, unknown>();
            expect(() => mapGetOrCreate(map, 'test', () => undefined)).toThrowError(ReferenceError);
        });
    });

    describe('invert', () => {
        test('should invert the keys and values of an object', () => {
            const map = {
                a: 'b',
                c: 'd',
            };
            const expected = {
                b: 'a',
                d: 'c',
            };
            const actual = invert(map);
            expect(actual).toEqual(expected);
        });
    });
});
