// Advent of Code - Day 12 - Part Two

import { alg, Graph } from '@dagrejs/graphlib';
import { isDefined } from '@lib/utils/general';

function height(node: string | undefined): number | undefined {
    if (typeof node === 'undefined') return undefined;
    return node === 'S' ? 1 : node === 'E' ? 26 : node.charCodeAt(0) - 96;
}

export function part2(input: string): number {
    const items = input
        .replaceAll('\r', '')
        .split('\n')
        .filter(Boolean)
        .map((lines) => lines.split(''));

    const g = new Graph({ directed: true });

    let start = '';
    let end = '';
    for (let y = 0; y < items.length; y++) {
        const row = items[y];
        if (typeof row === 'undefined') throw new ReferenceError('row is undefined');

        for (let x = 0; x < row.length; x++) {
            const nodeName = `${x},${y}`;

            const val = row[x];
            if (val === 'S') start = nodeName;
            if (val === 'E') end = nodeName;

            const currentHeight = height(val);
            if (!isDefined(currentHeight)) throw new TypeError('currentHeight is undefined');

            if (!g.hasNode(nodeName)) g.setNode(nodeName, { height: currentHeight });

            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    // Only allow horizontal and vertical edges
                    if (Math.abs(dy) === Math.abs(dx)) continue;

                    const ny = y + dy;
                    const nx = x + dx;
                    // Skip out of bounds
                    if (ny < 0 || nx < 0 || ny >= items.length || nx >= row.length) continue;

                    const neighbourName = `${nx},${ny}`;
                    const neighbourHeight = height(items[ny]?.[nx]);
                    if (!isDefined(neighbourHeight)) throw new TypeError('neighbourHeight is undefined');

                    if (neighbourHeight <= currentHeight + 1) {
                        if (!g.hasNode(neighbourName)) g.setNode(neighbourName, { height: neighbourHeight });
                        g.setEdge(neighbourName, nodeName);
                    }
                }
            }
        }
    }

    const paths = alg.dijkstra(g, end);
    const validPathDistances = Object.entries(paths)
        .filter(([nodeName]) => g.node(nodeName)?.height === 1)
        .map(([, node]) => node.distance);

    return Math.min(...validPathDistances);
}
