export const isDefined = <T>(v: T | undefined | null): v is T => typeof v !== 'undefined' && v !== null;

// eslint-disable-next-line @typescript-eslint/return-await
export const wait = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const times = <T>(n: number, operation: () => T): T[] => {
    const results: T[] = [];

    for (let i = 0; i < n; i++) {
        results.push(operation());
    }

    return results;
};

export const asyncTimes = async <T>(n: number, operation: () => Promise<T>): Promise<T[]> => {
    const results: T[] = [];

    for (let i = 0; i < n; i++) {
        results.push(await operation());
    }

    return results;
};

type Creator<V> = () => V;

export const mapGetOrCreate = <K, V>(map: Map<K, V>, key: K, creator: Creator<V>): V => {
    if (!map.has(key)) {
        map.set(key, creator());
    }

    const v = map.get(key);
    if (typeof v === 'undefined') throw new ReferenceError('No value found for key');

    return v;
};

export const invert = (map: Record<string | number | symbol, string | number | symbol>) => {
    return Object.entries(map).reduce<Record<string | number | symbol, string | number | symbol>>((inverted, [k, v]) => {
        inverted[v] = k;
        return inverted;
    }, {});
};
