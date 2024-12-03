// Advent of Code - Day 3 - Part Two

const mulRegex = /mul\((\d+),(\d+)\)/g;

export function part2(input: string): number {
    const program = input.trim();
    console.dir(program);
    const doBlocks = program.split('do()');
    const validBlocks = doBlocks.map((doBlock) => doBlock.split("don't()")).reduce((validBlocks, dontBlock) => {
        validBlocks.push(dontBlock[0]);
        return validBlocks;
    }, []);
    let result = 0;
    for (const block of validBlocks) {
        const muls = block.matchAll(mulRegex);
        if (!muls) throw new Error('No muls found');
        for (const mul of muls) {
            const [_, a, b] = mul;
            result += Number.parseInt(a) * Number.parseInt(b);
        }
    }
    return result;
}
