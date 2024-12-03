// Advent of Code - Day 3 - Part One

const mulRegex = /mul\((\d+),(\d+)\)/g;

export function part1(input: string): number {
    const program = input.trim();
    const muls = program.matchAll(mulRegex);
    if (!muls) throw new Error('No muls found');
    let result = 0;
    for (const mul of muls) {
        const [_, a, b] = mul;
        result += Number.parseInt(a) * Number.parseInt(b);
    }
    return result;
}
