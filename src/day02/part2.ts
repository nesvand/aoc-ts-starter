// Advent of Code - Day 2 - Part Two

import { isSafe } from "./part1";

export function part2(input: string): number {
    const items = input
        .replaceAll('\r', '')
        .split('\n')
        .filter(Boolean)
        .map((line) => line.split(' ').filter(Boolean).map(Number));
    let numSafe = 0;
    for (const levels of items) {
        if (isSafe(levels)) numSafe++;
        else {
            // Slow, but it works
            for (let i = 0; i < levels.length; i++) {
                const newLevels = levels.filter((_, j) => j !== i);
                if (isSafe(newLevels)) {
                    numSafe++;
                    break;
                }
            }
        }
    }
    return numSafe;
}
