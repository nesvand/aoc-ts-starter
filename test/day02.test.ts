// Advent of Code - Day 2
import { expect, test } from 'bun:test';
import { part1, part2 } from '../src/day02';

let input = '';
try {
    input = await Bun.file('src/day02/resources/input.txt').text();
} catch (e) {
    // ignore
}

test('part one test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part1(`7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`)).toBe(2);
});

if (input !== '') {
    test('part one answer', () => {
        expect(part1(input)).toBe(432);
    });
}

test('part two test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part2(`7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`)).toBe(4);
});

if (input !== '') {
    test('part two answer', () => {
        expect(part2(input)).toBe(488);
    });
}
