// Advent of Code - Day 4 - Part One

import { } from '@lib/general'

const dx = [-1, 0, 1, 0, -1, 1, -1, 1];
const dy = [0, 1, 0, -1, 1, -1, -1, 1];

export function outOfBounds(x: number, y: number, grid: string[][]): boolean {
    return x < 0 || x >= grid[0].length || y < 0 || y >= grid.length;
}

export function part1(input: string): number {
    const grid = input
        .replaceAll('\r', '')
        .split('\n')
        .map((line) => line.split(''));

    let count = 0;
    for (let x = 0; x < grid[0].length; x++) {
        for (let y = 0; y < grid.length; y++) {
            if (grid[y][x] !== 'X') continue;
            for (let offsetIdx = 0; offsetIdx < 8; offsetIdx++) {
                const cdx = dx[offsetIdx];
                const cdy = dy[offsetIdx];
                let neighbourX = x + cdx;
                let neighbourY = y + cdy;
                if (outOfBounds(neighbourX, neighbourY, grid)) continue;
                if (grid[neighbourY][neighbourX] === 'M') {
                    neighbourX += cdx;
                    neighbourY += cdy;
                    if (outOfBounds(neighbourX, neighbourY, grid)) continue;
                    if (grid[neighbourY][neighbourX] === 'A') {
                        neighbourX += cdx;
                        neighbourY += cdy;
                        if (outOfBounds(neighbourX, neighbourY, grid)) continue;
                        if (grid[neighbourY][neighbourX] === 'S') {
                            count++;
                        }
                    }
                }
            }
        }
    }
    return count;
}
