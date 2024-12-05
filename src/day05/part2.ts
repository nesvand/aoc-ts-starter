// Advent of Code - Day 5 - Part Two

export function part2(input: string): number {
    const [rawRules, rawPagesList] = input
        .replaceAll('\r', '')
        .split('\n\n')
        .map((lines) => lines.split('\n').filter(Boolean));
    const rules = rawRules.reduce((rs, line) => {
        const [x, y] = line.split('|').map(Number);
        rs[x] ??= [];
        rs[x].push(y);
        return rs;
    }, {} as Record<number, number[]>);
    const pagesList = rawPagesList.map((pages) => pages.split(',').map(Number));
    return 0;
}
