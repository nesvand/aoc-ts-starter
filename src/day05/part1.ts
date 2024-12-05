// Advent of Code - Day 5 - Part One

export function part1(input: string): number {
    const [_rules, _pages] = input
        .replaceAll('\r', '')
        .split('\n\n')
        .map((lines) => lines.split('\n').filter(Boolean));
    const rules = _rules.reduce((rs, line) => {
        const [x, y] = line.split('|').map(Number);
        rs.after[x] ??= [];
        rs.after[x].push(y);
        rs.before[y] ??= [];
        rs.before[y].push(x);
        return rs;
    }, { before: {}, after: {} } as { before: Record<number, number[]>, after: Record<number, number[]> });
    const pages = _pages.map((page) => page.split(',').map(Number));
    const middles = pages.filter((page) => {
        for (const [idx, pageNum] of page.entries()) {
            for (const [otherIdx, otherPageNum] of page.entries()) {
                if (idx === otherIdx) continue;
                if (otherIdx < idx) {
                    const before = rules.before[pageNum];
                    if (!before) return false;
                    if (!before.includes(otherPageNum)) return false;
                } else {
                    const after = rules.after[pageNum];
                    if (!after) return false;
                    if (!after.includes(otherPageNum)) return false;
                }
            }
        }
        return true;
    }).map((page) => page[Math.floor(page.length / 2)]);
    return middles.reduce((a, b) => a + b, 0);
}
