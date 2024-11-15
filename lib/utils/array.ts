export const sort = (values: number[]) => values.sort((a, b) => a - b);

export const sortby = <T>(values: T[], by: (v: T) => number) => values.sort((a, b) => by(a) - by(b));

export const sum = (a: number[]) => a.reduce((sum, n) => sum + n, 0);

export const product = (a: number[]) => a.reduce((p, n) => p * n, 1);

export const max = (a: number[]) => a.reduce((max, n) => Math.max(max, n), Number.NEGATIVE_INFINITY);

export const isArray = (values: unknown): values is unknown[] => Array.isArray(values);

export const lastIndex = <T>(arr: T[]): number => arr.length - 1;

export const lastItem = <T>(arr: T[]): T | undefined => arr[lastIndex(arr)];

export const lastItems = <T>(arr: T[], n: number): T[] => arr.slice(-n);

export const asNumbers = <T>(arr: T[]): number[] => arr.map((v) => Number(v));

export const from = <T = undefined>(size: number, creator?: (v: T, k: number) => T): T[] => {
    return Array.from({ length: size }, creator ?? (() => undefined as unknown as T));
};

export const zip = <T>(arr1: T[], arr2: T[]): Array<[T | undefined, T | undefined]> => {
    const maxLength = Math.max(arr1.length, arr2.length);

    return from(maxLength, (_, i) => [arr1[i], arr2[i]]);
};

export const splitOn = <T>(arr: T[], predicate: (v: T, i: number) => boolean): T[][] => {
    return arr.reduce<T[][]>(
        (chunks, item, i) => {
            if (predicate(item, i)) {
                chunks.push([]);
            } else {
                const currentChunkIndex = chunks.length - 1;
                chunks[currentChunkIndex]?.push(item);
            }
            return chunks;
        },
        [[]],
    );
};

export const chunk = <T>(arr: T[], size: number): T[][] => {
    return arr.reduce<T[][]>((chunks, item) => {
        const currentChunk = lastItem(chunks);

        if (isArray(currentChunk) && currentChunk.length < size) {
            currentChunk.push(item);
        } else {
            chunks.push([item]);
        }

        return chunks;
    }, []);
};

/**
 * An iterator that efficiently generates sliding windows over an array.
 * Each window is created only when requested, making it memory efficient
 * for large arrays or when early termination is possible.
 */
export class RollingWindowIterator<T> implements IterableIterator<T[]> {
    private currentIndex = 0;
    private readonly array: T[];
    private readonly windowSize: number;

    constructor(array: T[], windowSize: number) {
        this.array = array;
        this.windowSize = windowSize;
    }

    [Symbol.iterator](): IterableIterator<T[]> {
        return this;
    }

    next(): IteratorResult<T[]> {
        if (this.currentIndex > this.array.length - this.windowSize) {
            return { done: true, value: undefined };
        }

        const window = this.array.slice(this.currentIndex, this.currentIndex + this.windowSize);
        this.currentIndex++;
        return { done: false, value: window };
    }
}

/**
 * Creates an iterator that yields sliding windows over an array.
 *
 * @example
 * // Process windows until a condition is met
 * for (const window of rollingWindow(array, 3)) {
 *     if (someCondition(window)) {
 *         break;  // Stop processing early
 *     }
 * }
 *
 * @example
 * // Convert to array if all windows are needed
 * const allWindows = [...rollingWindow(array, 3)];
 *
 * @param arr - The input array to create windows from
 * @param size - The size of each window
 * @returns An iterator yielding arrays of size `size` containing consecutive elements
 *
 * Key benefits:
 * - Memory efficient: Only creates one window at a time
 * - Lazy evaluation: Windows are created only when requested
 * - Early termination: Can break from processing without creating unnecessary windows
 * - Flexible usage: Works with for...of loops and can be spread into an array
 */
export const rollingWindow = <T>(arr: T[], size: number): IterableIterator<T[]> => {
    if (size <= 0 || arr.length < size) {
        return [][Symbol.iterator]();
    }
    return new RollingWindowIterator(arr, size);
};
