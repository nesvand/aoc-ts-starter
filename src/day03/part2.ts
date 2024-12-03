// Advent of Code - Day 3 - Part Two

import { mulResult } from "./part1";

export function part2(input: string): number {
    const program = input.trim();
    console.dir(program);
    // Split on do() and don't()
    const doBlocks = program.split('do()');
    const validBlocks = doBlocks.map((doBlock) => doBlock.split("don't()")).reduce((validBlocks, dontBlock) => {
        // Because each block was originally a "do" block, the first element of the "don't" blocks must have immediately
        // followed a "do" block (or at least weren't preceded by a "don't" block). So we just return the first `dontBlock`
        // value and check it for muls just like in part 1
        validBlocks.push(dontBlock[0]);
        return validBlocks;
    }, []);
    let result = 0;
    for (const block of validBlocks) {
        result += mulResult(block);
    }
    return result;
}
