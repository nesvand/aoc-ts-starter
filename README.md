# Advent of Code Typescript Starter
[![Test Report](https://github.com/nesvand/aoc-solutions/actions/workflows/ci.yml/badge.svg)](https://github.com/nesvand/aoc-solutions/actions/workflows/ci.yml)

A template for [Advent of Code](https://adventofcode.com) written in Typescript with Node.

(Adapted from https://github.com/nesvand/aoc-solutions/actions/workflows/ci.yml)

## Usage

The project uses [Node.js](https://nodejs.org) for the javascript runtime, [pnpm](https://pnpm.io) for the package manager, and [Jest](https://jestjs.io) with [ts-jest](https://github.com/kulshekhar/ts-jest) for testing.

```bash
git clone https://github.com/nesvand/aoc-solutions
cd aoc-solutions
# install dependencies
pnpm install
# run tests for day01
pnpm test day01
# run day01
pnpm start day01
```

## Generate

You can generate all necessary files for use in the event with a simple command:

    $ pnpm gen day01

This command generates these files:

    * creating src/day01/resources/input.txt
    * creating src/day01/index.ts
    * creating src/day01/main.ts
    * creating src/day01/part1.ts
    * creating src/day01/part2.ts
    * creating src/day01/README.md
    * creating test/day01.test.spec.ts

- `/src/day01/resources/input.txt`: the input data.
- `/src/day01/index.ts`: export the modules for testing.
- `/src/day01/main.ts`: the main module.
- `/src/day01/part1.ts`: solution for part 1.
- `/src/day01/part2.ts`: solution for part 2.
- `/src/day01/README.md`: you can write the challenge statement.
- `/tests/day01.test.spec.ts`: the module where you write the tests.

## Config

You can configure the automatic input download from Advent of Code by using your session token.

To download the inputs from web, you need to set the environment var `AOC_SESSION`.
You can to get the session token from the cookie web browser.

Also can you set the `AOC_YEAR` to select a certain year.

(It is not mandatory use the `AOC_YEAR`, the `pnpm gen` can get the year automatically)

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

[MIT License](LICENSE)
