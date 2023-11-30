// Advent of Code - Day 16 - Part One

import { extract, int, word, optional } from '@lib/utils/strings';
import { StringView } from '@lib/utils/string-view';

export function part1(input: string): number {
    const extractor = extract`Valve ${word} has flow rate=${int}; tunnel${optional} lead to valve${optional} `;
    const delim = new StringView(', ');
    const items = input
        .replaceAll('\r', '')
        .split('\n')
        .filter(Boolean)
        .map((line) => {
            const l = new StringView(line);
            const [valve, flowRate, ,] = extractor(l);

            const toValves: string[] = [];
            while (l.size > 0) {
                // TODO: shouldn't have to trim, what's wrong?!
                toValves.push(l.chopByStringView(delim).trim().toString());
            }

            return { valve, flowRate, toValves };
        });
    console.log(items);
    return 0;
}
