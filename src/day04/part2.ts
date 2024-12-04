// Advent of Code - Day 4 - Part Two

import { outOfBounds } from "./part1";

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
            let valid = true;
            for (let offsetIdx = 0; offsetIdx < 4; offsetIdx++) {
                if (outOfBounds(x + diagonals[offsetIdx][0], y + diagonals[offsetIdx][1], grid)) {
                    valid = false;
                    break;
                }
            }
            if (!valid) continue;
            const diags = {
                nw: grid[y + diagonals[0][1]][x + diagonals[0][0]],
                se: grid[y + diagonals[1][1]][x + diagonals[1][0]],
                sw: grid[y + diagonals[2][1]][x + diagonals[2][0]],
                ne: grid[y + diagonals[3][1]][x + diagonals[3][0]],
            };
            if ((diags.nw === 'M' && diags.ne === 'M' && diags.se === 'S' && diags.sw === 'S') ||
                (diags.nw === 'S' && diags.ne === 'M' && diags.se === 'M' && diags.sw === 'S') ||
                (diags.nw === 'M' && diags.ne === 'S' && diags.se === 'S' && diags.sw === 'M') ||
                (diags.nw === 'S' && diags.ne === 'S' && diags.se === 'M' && diags.sw === 'M')) {
                count++;
            }
        }
    }
    return count;
}
