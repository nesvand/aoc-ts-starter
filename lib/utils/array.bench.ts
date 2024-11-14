import * as arrayUtils from "./array";

type TestCase = {
    name: string;
    // biome-ignore lint/complexity/noBannedTypes: Allowed for testing
    fn: Function;
    setup: () => unknown[];
};

// Pre-generate a fixed set of numbers instead of random ones
const ARRAY_SIZE = 100000;
const testData = {
    numbers: Array.from({ length: ARRAY_SIZE }, (_, i) => i % 1000), // 0-999 repeating
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

function runBenchmark(testName?: string) {
    const testCase = testCases.find(t => t.name === testName);

    if (!testCase) {
        console.error(`No test case found for "${testName}"`);
        process.exit(1);
    }

    const data = testCase.setup();
    testCase.fn(data);
    process.exit(0);
}

// Get the function name from command line arguments
const functionName = process.argv[2];
if (!functionName) {
    console.error("Please specify a function name");
    process.exit(1);
}

runBenchmark(functionName); 