import * as arrayUtils from "@lib/array";
import { type TestCase, runBenchmark, parseArgs } from "@lib/bench";

// Pre-generate a fixed set of numbers
const ARRAY_SIZE = 100000;
const testData = {
    numbers: Array.from({ length: ARRAY_SIZE }, (_, i) => i % 1000),
    sequential: Array.from({ length: ARRAY_SIZE }, (_, i) => i),
};

const testCases: TestCase[] = [
    {
        name: "max",
        fn: arrayUtils.max,
        setup: () => testData.numbers,
    },
    {
        name: "splitOn",
        fn: (arr: number[]) => arrayUtils.splitOn(arr, (n) => n % 100 === 0),
        setup: () => testData.sequential,
    },
    {
        name: "chunk",
        fn: (arr: number[]) => arrayUtils.chunk(arr, 100),
        setup: () => testData.sequential,
    },
    {
        name: "rollingWindow",
        fn: (arr: number[]) => arrayUtils.rollingWindow(arr, 50),
        setup: () => testData.sequential,
    },
];

const { functionName, options } = parseArgs(process.argv.slice(2));
runBenchmark(functionName, testCases, options); 