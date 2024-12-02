// Advent of Code - Day 2 - Part One

export function isSafe(levels: number[]): boolean {
    return levels.every((l, i, a) => i === 0 || (l - a[i - 1]) >= 1 && l - a[i - 1] <= 3) ||
        levels.every((l, i, a) => i === 0 || (l - a[i - 1]) <= -1 && l - a[i - 1] >= -3);
}

export function part1(input: string): number {
    const items = input
        .replaceAll('\r', '')
        .split('\n')
        .filter(Boolean)
        .map((line) => line.split(' ').filter(Boolean).map(Number))
        .map(isSafe)
        .filter(Boolean);
    return items.length;
}
