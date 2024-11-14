import chalk from 'chalk';
import cliProgress from 'cli-progress';

export type TestCase = {
    name: string;
    // biome-ignore lint/complexity/noBannedTypes: Allowed for testing
    fn: Function;
    setup: () => unknown;
};

export type BenchmarkOptions = {
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

export function runBenchmark(testName: string, testCases: TestCase[], options: BenchmarkOptions) {
    const testCase = testCases.find(t => t.name === testName);
    if (!testCase) {
        console.error(`No test case found for "${testName}"`);
        process.exit(1);
    }

    const data = testCase.setup();
    console.log(chalk.bold(`\nBenchmarking ${chalk.cyan(testName)}`));

    const multibar = new cliProgress.MultiBar({
        clearOnComplete: false,
        hideCursor: true,
        format: '{bar} {percentage}% | {value}/{total} {task}',
    }, cliProgress.Presets.shades_classic);

    const warmupBar = multibar.create(options.warmup, 0, { task: 'Warmup' });
    for (let i = 0; i < options.warmup; i++) {
        testCase.fn(data);
        warmupBar.increment();
        multibar.update();
    }

    const benchBar = multibar.create(options.runs, 0, { task: 'Runs' });
    const times: number[] = [];
    for (let i = 0; i < options.runs; i++) {
        const start = performance.now();
        testCase.fn(data);
        times.push(performance.now() - start);
        benchBar.increment();
        multibar.update();
    }

    multibar.stop();

    const stats = calculateStats(times);

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

export function parseArgs(args: string[]): { functionName: string; options: BenchmarkOptions } {
    const functionName = args[0];
    if (!functionName) {
        console.error("Please specify a function name");
        process.exit(1);
    }

    const options: BenchmarkOptions = {
        warmup: 0,
        runs: 1000,
    };

    for (let i = 1; i < args.length; i += 2) {
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

    return { functionName, options };
} 