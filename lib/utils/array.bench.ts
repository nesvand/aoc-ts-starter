import * as arrayUtils from "./array";
import chalk from 'chalk';
import cliProgress from 'cli-progress';

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

type BenchmarkOptions = {
    warmup: number;
    runs: number;
};

type BenchmarkResult = {
    mean: number;
    stdDev: number;
    min: number;
    max: number;
};

function calculateStats(times: number[]): BenchmarkResult {
    const mean = times.reduce((a, b) => a + b, 0) / times.length;
    const variance = times.reduce((a, b) => a + (b - mean) ** 2, 0) / times.length;
    return {
        mean,
        stdDev: Math.sqrt(variance),
        min: Math.min(...times),
        max: Math.max(...times),
    };
}

function formatTime(ms: number): string {
    if (ms < 0.001) return `${(ms * 1000000).toFixed(2)}ns`;
    if (ms < 1) return `${(ms * 1000).toFixed(2)}µs`;
    return `${ms.toFixed(2)}ms`;
}

function runBenchmark(testName: string, options: BenchmarkOptions) {
    const testCase = testCases.find(t => t.name === testName);
    if (!testCase) {
        console.error(`No test case found for "${testName}"`);
        process.exit(1);
    }

    const data = testCase.setup();
    console.log(chalk.bold(`\nBenchmarking ${chalk.cyan(testName)}`));

    // Progress bars
    const multibar = new cliProgress.MultiBar({
        clearOnComplete: false,
        hideCursor: true,
        format: '{bar} {percentage}% | {value}/{total} {task}',
    }, cliProgress.Presets.shades_classic);

    // Warmup progress
    const warmupBar = multibar.create(options.warmup, 0, { task: 'Warmup' });
    for (let i = 0; i < options.warmup; i++) {
        testCase.fn(data);
        warmupBar.increment();
        // Force update the display
        multibar.update();
    }

    // Benchmark progress
    const benchBar = multibar.create(options.runs, 0, { task: 'Runs' });
    const times: number[] = [];
    for (let i = 0; i < options.runs; i++) {
        const start = performance.now();
        testCase.fn(data);
        times.push(performance.now() - start);
        benchBar.increment();
        // Force update the display
        multibar.update();
    }

    multibar.stop();

    const stats = calculateStats(times);

    // Pretty output
    console.log('\nResults:');
    console.log('─'.repeat(50));
    console.log(`${chalk.bold('Mean:')}      ${chalk.green(formatTime(stats.mean))} ±${chalk.yellow(formatTime(stats.stdDev))}`);
    console.log(`${chalk.bold('Range:')}     ${chalk.blue(formatTime(stats.min))} to ${chalk.blue(formatTime(stats.max))}`);
    console.log(`${chalk.bold('Samples:')}   ${chalk.white(options.runs.toLocaleString())} runs`);
    if (options.warmup > 0) {
        console.log(`${chalk.bold('Warmup:')}    ${chalk.white(options.warmup.toLocaleString())} iterations`);
    }
    console.log('─'.repeat(50));
}

// Parse command line arguments
const args = process.argv.slice(2);
const functionName = args[0];
if (!functionName) {
    console.error("Please specify a function name");
    process.exit(1);
}

const options: BenchmarkOptions = {
    warmup: 0,
    runs: 1000,
};

// Parse --warmup and --runs options
for (let i = 1; i < args.length; i += 2) {
    // biome-ignore lint/style/noNonNullAssertion: Allowed for testing
    const value = Number.parseInt(args[i + 1]!);
    if (Number.isNaN(value)) {
        console.error(`Invalid value for ${args[i]}`);
        process.exit(1);
    }

    switch (args[i]) {
        case '--warmup':
            options.warmup = value;
            break;
        case '--runs':
            options.runs = value;
            break;
        default:
            console.error(`Unknown option: ${args[i]}`);
            process.exit(1);
    }
}

runBenchmark(functionName, options); 