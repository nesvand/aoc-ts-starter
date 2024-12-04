// Advent of Code - Day 4 - Part Two

const diagonals = [
    [-1, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
];

export function part2(input: string): number {
    const grid = input
        .replaceAll('\r', '')
        .split('\n')
        .map((line) => line.split(''));

    let count = 0;
    for (let x = 0; x < grid[0].length; x++) {
        for (let y = 0; y < grid.length; y++) {
            if (grid[y][x] !== 'A') continue;
            try {
                const nw = grid[y + diagonals[0][1]][x + diagonals[0][0]];
                const se = grid[y + diagonals[1][1]][x + diagonals[1][0]];
                const sw = grid[y + diagonals[2][1]][x + diagonals[2][0]];
                const ne = grid[y + diagonals[3][1]][x + diagonals[3][0]];
                if ((nw === 'S' && nw === ne && se === 'M' && se === sw) ||
                    (nw === 'M' && nw === ne && se === 'S' && se === sw) ||
                    (nw === 'S' && nw === sw && se === 'M' && se === ne) ||
                    (nw === 'M' && nw === sw && se === 'S' && se === ne)) {
                    count++;
                }
            } catch (_) {
                // don't care - catches out of bounds
            }
        }
    }
    return count;
}
