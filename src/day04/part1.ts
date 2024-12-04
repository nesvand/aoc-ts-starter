// Advent of Code - Day 4 - Part One

const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
];
const rest = ['M', 'A', 'S'];

function* gridIterator<T>(grid: T[][]) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            yield [x, y, grid[y][x]] as const;
        }
    }
}

export function part1(input: string): number {
    const grid = input
        .replaceAll('\r', '')
        .split('\n')
        .map((line) => line.split(''));

    let count = 0;
    for (const [x, y, cell] of gridIterator(grid)) {
        if (cell !== 'X') continue;
        for (const dir of directions) {
            try {
                const [cdx, cdy] = dir;
                let neighbourX = x + cdx;
                let neighbourY = y + cdy;
                for (const next of rest) {
                    if (grid[neighbourY][neighbourX] !== next) throw new Error('invalid path');
                    neighbourX += cdx;
                    neighbourY += cdy;
                }
                count++;
            } catch (_) {
                // don't care - catches out of bounds and invalid paths
            }
        }
    }
    return count;
}
