# Benchmark Results

Generated on: 2024-11-15T07:37:08.545Z


## Array Benchmarks

| Benchmark | Mean | Margin | Operations/sec |
|-----------|------|--------|---------------|
| max | 275.33µs | ±163.91µs | 3,632.01 |
| splitOn | 639.96µs | ±248.09µs | 1,562.6 |
| chunk | 1.09ms | ±360.39µs | 917.43 |
| rollingWindow | 8.28ms | ±1.79ms | 120.77 |


## Bits Benchmarks

| Benchmark | Mean | Margin | Operations/sec |
|-----------|------|--------|---------------|
| bitsToNumber-16 | 178.40ns | ±154.64ns | 5,605,381.17 |
| bitsToNumber-32 | 189.80ns | ±240.07ns | 5,268,703.9 |
| bitStringToNumber-16 | 208.10ns | ±137.20ns | 4,805,382.03 |
| bitSubstring-medium | 263.00ns | ±1.19µs | 3,802,281.37 |
| bitStringToNumber-32 | 294.70ns | ±180.56ns | 3,393,281.3 |
| bitSubstring-large | 303.60ns | ±1.30µs | 3,293,807.64 |
| bitsToNumber-53 | 313.40ns | ±1.47µs | 3,190,810.47 |
| bitStringToNumber-53 | 415.40ns | ±588.44ns | 2,407,318.25 |
| hexToPaddedBinary-small | 567.00ns | ±3.22µs | 1,763,668.43 |
| hexToPaddedBinary-medium | 655.60ns | ±1.05µs | 1,525,320.32 |
| bitSubstring-small | 663.10ns | ±10.28µs | 1,508,068.16 |
| hexToPaddedBinary-large | 1.47µs | ±1.33µs | 680,272.11 |


## String-view Benchmarks

| Benchmark | Mean | Margin | Operations/sec |
|-----------|------|--------|---------------|
| cached-segmentation | 235.20ns | ±679.65ns | 4,251,700.68 |
| create-large | 256.40ns | ±2.45µs | 3,900,156.01 |
| chopInt-signed | 322.30ns | ±774.80ns | 3,102,699.35 |
| create-small | 324.00ns | ±2.86µs | 3,086,419.75 |
| chopLeft-ascii | 431.20ns | ±867.92ns | 2,319,109.46 |
| chopFloat-signed | 489.60ns | ±3.19µs | 2,042,483.66 |
| chopLeft-unicode | 573.20ns | ±4.39µs | 1,744,591.77 |
| chopFloat-simple | 648.60ns | ±1.30µs | 1,541,782.3 |
| chopInt-simple | 1.47µs | ±26.90µs | 680,272.11 |
| trim-small | 2.02µs | ±24.06µs | 495,049.5 |
| trim-large | 2.46µs | ±29.40µs | 406,504.07 |
| parseFloat | 3.11µs | ±35.82µs | 321,543.41 |
| parseInt | 3.29µs | ±11.77µs | 303,951.37 |
| iterate-unicode | 5.27µs | ±3.25µs | 189,753.32 |
| iterate-ascii | 5.99µs | ±35.67µs | 166,944.91 |
| chopInt-mixed | 32.90µs | ±9.78µs | 30,395.14 |
| complex-emoji-handling | 37.69µs | ±18.07µs | 26,532.24 |
| chopFloat-mixed | 43.98µs | ±86.21µs | 22,737.61 |
| charAt-ascii | 202.75µs | ±130.44µs | 4,932.18 |
| charAt-unicode | 212.72µs | ±150.06µs | 4,701.02 |

