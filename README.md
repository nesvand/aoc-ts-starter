# Advent of Code Typescript Starter

A template for [Advent of Code](https://adventofcode.com) written in Typescript with Node.

(Adapted from https://github.com/ljgago - repo not available)

## Usage

The project uses [Bun](https://bun.sh) for the javascript runtime, package manager, and for testing.

```bash
git clone https://github.com/nesvand/aoc-ts-starter
cd aoc-ts-starter
# install dependencies
bun install
# ensure you have AOC_SESSION and/or AOC_YEAR set as environment variables accordingly
# generate files for day01
bun gen day01
# run tests for day01
bun test day01
# run day01
bun start day01
```

## Generate

You can generate all necessary files for use in the event with a simple command:

    $ bun gen day01

This command generates these files:

    * creating src/day01/resources/input.txt
    * creating src/day01/index.ts
    * creating src/day01/main.ts
    * creating src/day01/part1.ts
    * creating src/day01/part2.ts
    * creating src/day01/README.md
    * creating test/day01.test.spec.ts

-   `/src/day01/resources/input.txt`: the input data.
-   `/src/day01/index.ts`: export the modules for testing.
-   `/src/day01/main.ts`: the main module.
-   `/src/day01/part1.ts`: solution for part 1.
-   `/src/day01/part2.ts`: solution for part 2.
-   `/src/day01/README.md`: you can write the challenge statement.
-   `/tests/day01.test.spec.ts`: the module where you write the tests.

## Config

You can configure the automatic input download from Advent of Code by using your session token.

To download the inputs from web, you need to set the environment var `AOC_SESSION`.
You can to get the session token from the cookie web browser.

Also can you set the `AOC_YEAR` to select a certain year.

(It is not mandatory use the `AOC_YEAR`, the `bun gen` can get the year automatically)

You can set an `.env` file with these variables.

Folder structure:

    ├── src
    │   └── day01
    │       ├── index.ts
    │       ├── main.ts
    │       ├── part1.ts
    │       ├── part2.ts
    │       ├── README.md
    │       └── resources
    │           └── input.txt
    └── test
        └── day01.test.spec.ts

Happy coding!

## Benchmarking

The project includes a benchmarking utility to measure the performance of your solutions. You can benchmark specific functions using:

```bash
bun run lib/utils/array.bench.ts <function-name> [options]
```

```
Options:
  -w, --warmup  Number of warmup iterations       [number] [default: 0]
  -r, --runs    Number of benchmark runs          [number] [default: 1000]
  -h, --help    Show help                         [boolean]
```

Example:
```bash
# Run 'max' function benchmark with 100 warmup iterations and 1000 runs
bun run lib/utils/array.bench.ts max -w 100 -r 1000

# Show help and available options
bun run lib/utils/array.bench.ts --help
```

To create benchmarks for your own functions:
1. Create a new benchmark file (e.g., `myutils.bench.ts`)
2. Import the benchmark utilities:
```typescript
import { type TestCase, runBenchmark, parseArgs } from "./bench";
```
3. Define your test cases:
```typescript
const testCases: TestCase[] = [
    {
        name: "myFunction",
        fn: myFunction,
        setup: () => yourTestData,
    },
];
```
4. Run the benchmark:
```typescript
const { functionName, options } = parseArgs(process.argv);
runBenchmark(functionName, testCases, options);
```

The benchmark will display a progress bar during execution and output statistics including:
- Mean execution time with standard deviation
- Min/max execution times
- Number of runs and warmup iterations

## Additional Credits

`StringView` is adapted from [sv](https://github.com/tsoding/sv) by [Alexey Kutepov](https://github.com/tsoding).

[MIT License](LICENSE)
