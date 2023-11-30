// Advent of Code - Day 15 - Part One

import { extract, int } from '@lib/utils/strings';
import { StringView } from '@lib/utils/string-view';

export function part1(input: string): number {
    const extractor = extract`Sensor at x=${int}, y=${int}: closest beacon is at x=${int}, y=${int}`;

    const items = input
        .replaceAll('\r', '')
        .split('\n')
        .filter(Boolean)
        .map((line) => {
            const [sx, sy, bx, by] = extractor(new StringView(line));
            return { sx, sy, bx, by };
        });
    console.log(items);
    return 0;
}
