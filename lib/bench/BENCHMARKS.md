# Benchmark Results

Generated on: 2024-11-15T12:17:32.934Z


## Array Benchmarks

| Benchmark | Mean | Margin | Operations/sec |
|-----------|------|--------|---------------|
| max | 257.06µs | ±63.37µs | 3,890.14 |
| splitOn | 662.42µs | ±377.27µs | 1,509.62 |
| chunk | 1.08ms | ±242.12µs | 925.93 |
| rollingWindow | 9.95ms | ±3.08ms | 100.5 |


## Bits Benchmarks

| Benchmark | Mean | Margin | Operations/sec |
|-----------|------|--------|---------------|
| bitsToNumber-16 | 219.30ns | ±481.16ns | 4,559,963.52 |
| bitStringToNumber-16 | 223.00ns | ±158.72ns | 4,484,304.93 |
| bitsToNumber-53 | 255.90ns | ±726.95ns | 3,907,776.48 |
| bitSubstring-small | 260.20ns | ±1.61µs | 3,843,197.54 |
| bitsToNumber-32 | 296.90ns | ±3.06µs | 3,368,137.42 |
| bitSubstring-medium | 301.30ns | ±1.60µs | 3,318,951.21 |
| bitStringToNumber-32 | 354.30ns | ±496.49ns | 2,822,466.84 |
| bitSubstring-large | 359.60ns | ±1.50µs | 2,780,867.63 |
| hexToPaddedBinary-small | 420.60ns | ±821.30ns | 2,377,555.87 |
| bitStringToNumber-53 | 523.30ns | ±3.89µs | 1,910,949.74 |
| hexToPaddedBinary-medium | 616.50ns | ±1.12µs | 1,622,060.02 |
| hexToPaddedBinary-large | 1.55µs | ±1.51µs | 645,161.29 |


## String-view Benchmarks

| Benchmark | Mean | Margin | Operations/sec |
|-----------|------|--------|---------------|
| create-small | 247.70ns | ±850.83ns | 4,037,141.7 |
| chopFloat-signed | 403.10ns | ±921.05ns | 2,480,774 |
| chopInt-signed | 481.60ns | ±3.02µs | 2,076,411.96 |
| chopLeft-unicode | 542.90ns | ±2.99µs | 1,841,959.85 |
| chopInt-simple | 554.60ns | ±3.17µs | 1,803,101.33 |
| trim-small | 762.70ns | ±3.29µs | 1,311,131.51 |
| trim-large | 766.30ns | ±3.26µs | 1,304,971.94 |
| chopLeft-ascii | 803.00ns | ±8.23µs | 1,245,330.01 |
| chopFloat-simple | 830.30ns | ±10.95µs | 1,204,383.96 |
| create-large | 904.30ns | ±20.95µs | 1,105,827.71 |
| cached-segmentation | 948.40ns | ±23.11µs | 1,054,407.42 |
| parseFloat | 2.21µs | ±6.26µs | 452,488.69 |
| parseInt | 4.21µs | ±35.13µs | 237,529.69 |
| iterate-unicode | 4.74µs | ±4.28µs | 210,970.46 |
| iterate-ascii | 6.50µs | ±29.47µs | 153,846.15 |
| chopInt-mixed | 34.39µs | ±12.00µs | 29,078.22 |
| complex-emoji-handling | 41.90µs | ±24.99µs | 23,866.35 |
| chopFloat-mixed | 49.28µs | ±149.11µs | 20,292.21 |
| charAt-ascii | 230.72µs | ±139.13µs | 4,334.26 |
| charAt-unicode | 235.19µs | ±229.93µs | 4,251.88 |

