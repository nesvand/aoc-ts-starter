// Advent of Code - Day 16
import { readFileSync } from 'fs';

let input = '';
try {
    input = readFileSync('src/day16/resources/input.txt', 'utf8');
} catch (e) {
    // ignore
}

import { part1, part2 } from '../src/day16';

test('part one test', () => {
    expect(part1(``)).toBe(0);
});

if (input) {
    test('part one answer', () => {
        expect(part1(input)).toBe(0);
    });
}

test('part two test', () => {
    expect(part2(``)).toBe(0);
});

if (input) {
    test('part two answer', () => {
        expect(part2(input)).toBe(0);
    });
}
