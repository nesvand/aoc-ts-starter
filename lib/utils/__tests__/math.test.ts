import { math } from '@lib/utils';

const { isNumber } = math;

describe('utils/math', () => {
    describe('isNumber', () => {
        test('should return true for numbers', () => {
            const testValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            testValues.forEach((value) => {
                expect(isNumber(value)).toBe(true);
            });
        });
    });
});
