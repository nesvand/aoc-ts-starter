// Advent of Code - Day 1 - Part One

import { max, sum, asNumbers } from '@lib/utils/array';

export function part1(input: string): number {
    return max(
        input
            .replaceAll('\r', '')
            .split('\n\n')
            .map((lines) => sum(asNumbers(lines.split('\n').filter(Boolean))))
    );
}
