// Advent of Code - Day 4
import { expect, test } from 'bun:test';
import { part1, part2 } from '../src/day04';

let input = '';
try {
    input = await Bun.file('src/day04/resources/input.txt').text();
} catch (e) {
    // ignore
}

test('part one test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part1(`MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`)).toBe(18);
});

if (input !== '') {
    test('part one answer', () => {
        expect(part1(input)).toBe(2378);
    });
}

test('part two test', () => {
    // biome-ignore lint/style/noUnusedTemplateLiteral: Empty by design
    expect(part2(`MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`)).toBe(9);
});

if (input !== '') {
    test('part two answer', () => {
        expect(part2(input)).toBe(1796);
    });
}
