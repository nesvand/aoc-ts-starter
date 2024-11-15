# Benchmark Results

Generated on: 2024-11-15T12:46:02.992Z


## Array Benchmarks

| Benchmark | Mean | Margin | Operations/sec |
|-----------|------|--------|---------------|
| max | 260.48µs | ±38.58µs | 3,839.07 |
| splitOn | 646.41µs | ±240.77µs | 1,547.01 |
| chunk | 1.07ms | ±213.92µs | 934.58 |
| rollingWindow | 10.47ms | ±2.64ms | 95.51 |


## Bits Benchmarks

| Benchmark | Mean | Margin | Operations/sec |
|-----------|------|--------|---------------|
| bitStringToNumber-16 | 241.80ns | ±448.50ns | 4,135,649.3 |
| bitsToNumber-16 | 246.20ns | ±677.87ns | 4,061,738.42 |
| bitsToNumber-32 | 254.00ns | ±495.02ns | 3,937,007.87 |
| bitSubstring-small | 265.00ns | ±1.52µs | 3,773,584.91 |
| bitSubstring-medium | 269.80ns | ±1.30µs | 3,706,449.22 |
| bitStringToNumber-32 | 303.00ns | ±150.97ns | 3,300,330.03 |
| hexToPaddedBinary-small | 313.80ns | ±426.84ns | 3,186,743.15 |
| bitsToNumber-53 | 369.00ns | ±2.81µs | 2,710,027.1 |
| bitStringToNumber-53 | 387.30ns | ±184.90ns | 2,581,977.79 |
| bitSubstring-large | 583.90ns | ±9.08µs | 1,712,622.02 |
| hexToPaddedBinary-large | 1.77µs | ±2.98µs | 564,971.75 |
| hexToPaddedBinary-medium | 2.65µs | ±53.05µs | 377,358.49 |


## String-view Benchmarks

| Benchmark | Mean | Margin | Operations/sec |
|-----------|------|--------|---------------|
| create-small | 235.30ns | ±765.73ns | 4,249,893.75 |
| cached-segmentation | 281.70ns | ±543.74ns | 3,549,875.75 |
| create-large | 305.10ns | ±1.97µs | 3,277,613.9 |
| chopLeft-ascii | 439.80ns | ±1.90µs | 2,273,760.8 |
| complex-emoji-handling | 553.20ns | ±1.78µs | 1,807,664.5 |
| charAt-unicode | 717.60ns | ±1.04µs | 1,393,534 |
| chopInt-simple | 795.90ns | ±5.03µs | 1,256,439.25 |
| charAt-ascii | 823.51ns | ±1.09µs | 1,214,314.34 |
| trim-large | 870.70ns | ±1.56µs | 1,148,501.21 |
| trim-small | 1.04µs | ±8.81µs | 961,538.46 |
| chopLeft-unicode | 1.04µs | ±3.55µs | 961,538.46 |
| chopFloat-simple | 1.08µs | ±17.04µs | 925,925.93 |
| chopInt-signed | 1.20µs | ±18.13µs | 833,333.33 |
| chopFloat-signed | 1.21µs | ±18.94µs | 826,446.28 |
| parseFloat | 3.39µs | ±33.27µs | 294,985.25 |
| parseInt | 5.49µs | ±46.82µs | 182,149.36 |
| iterate-ascii | 6.52µs | ±6.95µs | 153,374.23 |
| iterate-unicode | 16.76µs | ±345.60µs | 59,665.87 |
| chopInt-mixed | 36.35µs | ±45.03µs | 27,510.32 |
| chopFloat-mixed | 52.75µs | ±185.66µs | 18,957.35 |

