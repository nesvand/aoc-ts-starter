# Benchmark Results

Generated on: 2024-11-15T10:58:03.804Z


## Array Benchmarks

| Benchmark | Mean | Margin | Operations/sec |
|-----------|------|--------|---------------|
| max | 294.08µs | ±276.13µs | 3,400.44 |
| splitOn | 670.50µs | ±253.99µs | 1,491.42 |
| chunk | 1.11ms | ±322.36µs | 900.9 |
| rollingWindow | 10.56ms | ±3.18ms | 94.7 |


## Bits Benchmarks

| Benchmark | Mean | Margin | Operations/sec |
|-----------|------|--------|---------------|
| bitsToNumber-16 | 188.60ns | ±220.93ns | 5,302,226.94 |
| bitStringToNumber-16 | 231.10ns | ±203.18ns | 4,327,131.11 |
| bitsToNumber-32 | 255.21ns | ±392.22ns | 3,918,341.76 |
| bitsToNumber-53 | 275.50ns | ±359.80ns | 3,629,764.07 |
| bitSubstring-small | 276.70ns | ±1.46µs | 3,614,022.41 |
| hexToPaddedBinary-small | 331.91ns | ±521.74ns | 3,012,864.93 |
| bitStringToNumber-32 | 371.01ns | ±271.99ns | 2,695,345.14 |
| bitSubstring-large | 396.21ns | ±1.75µs | 2,523,914.09 |
| bitStringToNumber-53 | 427.41ns | ±275.79ns | 2,339,673.85 |
| bitSubstring-medium | 587.61ns | ±10.07µs | 1,701,809.02 |
| hexToPaddedBinary-medium | 869.71ns | ±3.65µs | 1,149,808.56 |
| hexToPaddedBinary-large | 2.41µs | ±15.81µs | 414,937.76 |


## String-view Benchmarks

| Benchmark | Mean | Margin | Operations/sec |
|-----------|------|--------|---------------|
| create-small | 269.51ns | ±2.58µs | 3,710,437.46 |
| create-large | 331.31ns | ±3.28µs | 3,018,321.21 |
| chopLeft-unicode | 423.91ns | ±1.28µs | 2,358,991.3 |
| chopFloat-simple | 559.80ns | ±3.53µs | 1,786,352.27 |
| cached-segmentation | 563.41ns | ±9.61µs | 1,774,906.37 |
| chopLeft-ascii | 609.31ns | ±2.28µs | 1,641,200.7 |
| chopFloat-signed | 609.81ns | ±4.15µs | 1,639,855.04 |
| trim-small | 744.51ns | ±1.35µs | 1,343,165.3 |
| trim-large | 745.01ns | ±3.59µs | 1,342,263.86 |
| chopInt-simple | 857.51ns | ±15.51µs | 1,166,167.16 |
| chopInt-signed | 1.24µs | ±21.64µs | 806,451.61 |
| parseFloat | 2.62µs | ±8.55µs | 381,679.39 |
| parseInt | 5.06µs | ±60.60µs | 197,628.46 |
| iterate-ascii | 5.44µs | ±5.74µs | 183,823.53 |
| iterate-unicode | 6.82µs | ±3.45µs | 146,627.57 |
| chopFloat-mixed | 38.43µs | ±20.61µs | 26,021.34 |
| chopInt-mixed | 38.68µs | ±57.08µs | 25,853.15 |
| complex-emoji-handling | 45.71µs | ±78.06µs | 21,877.05 |
| charAt-ascii | 216.79µs | ±147.79µs | 4,612.76 |
| charAt-unicode | 228.24µs | ±174.65µs | 4,381.35 |

