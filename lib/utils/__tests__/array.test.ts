import { array } from '@lib/utils';

const { sort, sortby, sum, product, max, isArray, lastIndex, lastItem, lastItems, asNumbers, from, zip, splitOn, chunk, rollingWindow } = array;

describe('utils/array', () => {
    describe('sort', () => {
        it('should sort numbers', () => {
            expect(sort([3, 2, 1])).toEqual([1, 2, 3]);
        });
    });

    describe('sortby', () => {
        it('should sort by a number property', () => {
            expect(sortby([{ a: 3 }, { a: 2 }, { a: 1 }], (v) => v.a)).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
        });
    });

    describe('sum', () => {
        it('should sum numbers', () => {
            expect(sum([1, 2, 3])).toEqual(6);
        });
    });

    describe('product', () => {
        it('should multiply numbers', () => {
            expect(product([1, 2, 3])).toEqual(6);
        });
    });

    describe('max', () => {
        it('should find the max number', () => {
            expect(max([1, 2, 3])).toEqual(3);
        });
    });

    describe('isArray', () => {
        it('should return true for arrays', () => {
            expect(isArray([])).toEqual(true);
        });

        it('should return false for non-arrays', () => {
            expect(isArray(1)).toEqual(false);
        });
    });

    describe('lastIndex', () => {
        it('should return the last index', () => {
            expect(lastIndex([1, 2, 3])).toEqual(2);
        });
    });

    describe('lastItem', () => {
        it('should return the last item', () => {
            expect(lastItem([1, 2, 3])).toEqual(3);
        });
    });

    describe('lastItems', () => {
        it('should return the last n items', () => {
            expect(lastItems([1, 2, 3], 2)).toEqual([2, 3]);
        });
    });

    describe('asNumbers', () => {
        it('should convert to numbers', () => {
            expect(asNumbers(['1', '2', '3'])).toEqual([1, 2, 3]);
        });
    });

    describe('from', () => {
        it('should create an array of the given size', () => {
            expect(from(3)).toEqual([undefined, undefined, undefined]);
        });

        it('should create an array of the given size with the given creator', () => {
            expect(from(3, () => 1)).toEqual([1, 1, 1]);
        });
    });

    describe('zip', () => {
        it('should zip two arrays', () => {
            expect(zip([1, 2, 3], [4, 5, 6])).toEqual([
                [1, 4],
                [2, 5],
                [3, 6],
            ]);
        });
    });

    describe('splitOn', () => {
        it('should split an array on a value', () => {
            expect(splitOn([1, 2, 3, 4, 5], (v) => v === 3)).toEqual([
                [1, 2],
                [4, 5],
            ]);
        });
    });

    describe('chunk', () => {
        it('should chunk an array', () => {
            expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
        });
    });

    describe('rollingWindow', () => {
        it('should create a rolling window', () => {
            expect(rollingWindow([1, 2, 3, 4, 5], 2)).toEqual([
                [1, 2],
                [2, 3],
                [3, 4],
                [4, 5],
            ]);
        });
    });
});
