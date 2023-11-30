// Advent of Code - Day 1 - Part Two

import * as array from '@lib/utils/array';

export function part2(input: string): number {
    return array.sum(
        array
            .sort(
                input
                    .replaceAll('\r', '')
                    .split('\n\n')
                    .map((lines) => array.sum(array.asNumbers(lines.split('\n').filter(Boolean))))
            )
            .reverse()
            .slice(0, 3)
    );
}
