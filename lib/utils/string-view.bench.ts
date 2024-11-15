import { type TestCase, runBenchmark, parseArgs } from "./bench";
import { StringView } from "./string-view";

// Test data with various content types and sizes
const testData = {
    // ASCII only
    smallAscii: "hello world",
    mediumAscii: "hello world".repeat(10),
    largeAscii: "hello world".repeat(100),

    // Mixed content (ASCII, emoji, CJK)
    smallMixed: "Hello 👋 世界",
    mediumMixed: "Hello 👋 世界 ".repeat(10),
    largeMixed: "Hello 👋 世界 ".repeat(100),

    // Whitespace handling
    leadingWhitespace: "   \t\n\rHello",
    trailingWhitespace: "Hello   \t\n\r",
    mixedWhitespace: "   Hello   World   ",

    // Numbers
    integers: "12345678901234567890",
    floats: "123.456.789",
    
    // Complex emoji sequences
    complexEmoji: "👨‍👩‍👧‍👦 👨🏻‍💻 🏳️‍🌈",
};

const testCases: TestCase[] = [
    // Construction tests
    {
        name: "create-small",
        fn: (str: string) => new StringView(str),
        setup: () => testData.smallAscii,
    },
    {
        name: "create-large",
        fn: (str: string) => new StringView(str),
        setup: () => testData.largeAscii,
    },

    // Basic operations
    {
        name: "charAt-ascii",
        fn: (sv: StringView) => {
            for (let i = 0; i < 10; i++) sv.charAt(i);
        },
        setup: () => new StringView(testData.mediumAscii),
    },
    {
        name: "charAt-unicode",
        fn: (sv: StringView) => {
            for (let i = 0; i < 10; i++) sv.charAt(i);
        },
        setup: () => new StringView(testData.mediumMixed),
    },

    // Iteration
    {
        name: "iterate-ascii",
        fn: (sv: StringView) => {
            for (const _ of sv) { /* noop */ }
        },
        setup: () => new StringView(testData.mediumAscii),
    },
    {
        name: "iterate-unicode",
        fn: (sv: StringView) => {
            for (const _ of sv) { /* noop */ }
        },
        setup: () => new StringView(testData.mediumMixed),
    },

    // Whitespace handling
    {
        name: "trim-small",
        fn: (sv: StringView) => sv.trim(),
        setup: () => new StringView(testData.mixedWhitespace),
    },
    {
        name: "trim-large",
        fn: (sv: StringView) => sv.trim(),
        setup: () => new StringView(`   ${testData.largeMixed}   `),
    },

    // Chopping operations
    {
        name: "chopLeft-ascii",
        fn: (sv: StringView) => sv.chopLeft(5),
        setup: () => new StringView(testData.mediumAscii),
    },
    {
        name: "chopLeft-unicode",
        fn: (sv: StringView) => sv.chopLeft(5),
        setup: () => new StringView(testData.mediumMixed),
    },

    // Parsing operations
    {
        name: "parseInt",
        fn: (sv: StringView) => sv.toInt(),
        setup: () => new StringView(testData.integers),
    },
    {
        name: "parseFloat",
        fn: (sv: StringView) => sv.toFloat(),
        setup: () => new StringView(testData.floats),
    },

    // Complex operations
    {
        name: "complex-emoji-handling",
        fn: (sv: StringView) => {
            sv.charAt(0);  // Should handle the family emoji correctly
            sv.charAt(2);  // Should handle the technologist emoji correctly
            sv.charAt(4);  // Should handle the rainbow flag correctly
        },
        setup: () => new StringView(testData.complexEmoji),
    },

    // Cache effectiveness
    {
        name: "cached-segmentation",
        fn: (sv: StringView) => {
            for (let i = 0; i < 10; i++) {
                sv.graphemeLength;  // Should use cache after first call
            }
        },
        setup: () => new StringView(testData.mediumMixed),
    },
];

// Run the benchmark
const { functionName, options } = parseArgs(process.argv);
runBenchmark(functionName, testCases, options); 