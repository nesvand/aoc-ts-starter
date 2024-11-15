import { type TestCase, runBenchmark, parseArgs } from "@lib/bench";
import * as bits from "@lib/bits";

// Test data with various sizes and patterns
const testData = {
    // Small hex string (16 bits)
    smallHex: "FFFF",
    // Medium hex string (64 bits)
    mediumHex: "FFFFFFFFFFFFFFFF",
    // Large hex string (256 bits)
    largeHex: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",

    // Pre-computed binary strings for different sizes
    smallBinary: "1".repeat(16),
    mediumBinary: "1".repeat(64),
    largeBinary: "1".repeat(256),

    // Bit array
    bits: Array.from({ length: 64 }, () => 1 as bits.Bit),
};

const testCases: TestCase[] = [
    // hexToPaddedBinary tests
    {
        name: "hexToPaddedBinary-small",
        fn: bits.hexToPaddedBinary,
        setup: () => testData.smallHex,
    },
    {
        name: "hexToPaddedBinary-medium",
        fn: bits.hexToPaddedBinary,
        setup: () => testData.mediumHex,
    },
    {
        name: "hexToPaddedBinary-large",
        fn: bits.hexToPaddedBinary,
        setup: () => testData.largeHex,
    },

    // bitStringToNumber tests
    {
        name: "bitStringToNumber-16",
        fn: bits.bitStringToNumber,
        setup: () => testData.smallBinary,
    },
    {
        name: "bitStringToNumber-32",
        fn: bits.bitStringToNumber,
        setup: () => testData.mediumBinary.slice(0, 32),
    },
    {
        name: "bitStringToNumber-53", // Max safe integer bits
        fn: bits.bitStringToNumber,
        setup: () => testData.mediumBinary.slice(0, 53),
    },

    // bitsToNumber tests
    {
        name: "bitsToNumber-16",
        fn: bits.bitsToNumber,
        setup: () => testData.bits.slice(0, 16),
    },
    {
        name: "bitsToNumber-32",
        fn: bits.bitsToNumber,
        setup: () => testData.bits.slice(0, 32),
    },
    {
        name: "bitsToNumber-53",
        fn: bits.bitsToNumber,
        setup: () => testData.bits.slice(0, 53),
    },

    // bitSubstring tests
    {
        name: "bitSubstring-small",
        fn: (str: string) => bits.bitSubstring(str, 0, 8),
        setup: () => testData.smallBinary,
    },
    {
        name: "bitSubstring-medium",
        fn: (str: string) => bits.bitSubstring(str, 16, 32),
        setup: () => testData.mediumBinary,
    },
    {
        name: "bitSubstring-large",
        fn: (str: string) => bits.bitSubstring(str, 64, 96),
        setup: () => testData.largeBinary,
    },
];

// Run the benchmark
const { functionName, options } = parseArgs(process.argv);
runBenchmark(functionName, testCases, options); 