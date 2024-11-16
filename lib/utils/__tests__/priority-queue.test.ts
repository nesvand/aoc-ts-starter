import { describe, expect, test } from 'bun:test';
import { PriorityQueue } from '@lib/data';

describe('PriorityQueue', () => {
    test('should handle basic operations', () => {
        const pq = new PriorityQueue<string>();
        pq.enqueue('task1', 1);
        pq.enqueue('task2', 2);
        pq.enqueue('task3', 3);

        expect(pq.peek()).toBe('task3');
        expect(pq.dequeue()).toBe('task3');
        expect(pq.dequeue()).toBe('task2');
        expect(pq.dequeue()).toBe('task1');
        expect(pq.isEmpty()).toBe(true);
    });

    test('should handle priority updates', () => {
        const pq = new PriorityQueue<string>();
        pq.enqueue('task1', 1);
        pq.enqueue('task2', 2);
        pq.enqueue('task3', 3);

        pq.updatePriority('task1', 4);
        expect(pq.dequeue()).toBe('task1');
        expect(pq.dequeue()).toBe('task3');
        expect(pq.dequeue()).toBe('task2');
    });

    test('should support min heap', () => {
        const minPQ = new PriorityQueue<string>((a, b) => a - b);
        minPQ.enqueue('task1', 3);
        minPQ.enqueue('task2', 1);
        minPQ.enqueue('task3', 2);

        expect(minPQ.dequeue()).toBe('task2');
        expect(minPQ.dequeue()).toBe('task3');
        expect(minPQ.dequeue()).toBe('task1');
    });

    test('should handle custom priorities', () => {
        interface Task {
            urgency: number;
            complexity: number;
        }

        const pq = new PriorityQueue<string, Task>((a, b) => {
            if (a.urgency !== b.urgency) {
                return b.urgency - a.urgency;
            }
            return b.complexity - a.complexity;
        });

        pq.enqueue('task1', { urgency: 1, complexity: 2 });
        pq.enqueue('task2', { urgency: 1, complexity: 3 });
        pq.enqueue('task3', { urgency: 2, complexity: 1 });

        expect(pq.dequeue()).toBe('task3');
        expect(pq.dequeue()).toBe('task2');
        expect(pq.dequeue()).toBe('task1');
    });

    test('should throw for invalid operations', () => {
        const pq = new PriorityQueue<string>();

        expect(() => pq.dequeue()).toThrow('Queue is empty');
        expect(() => pq.peek()).toThrow('Queue is empty');

        pq.enqueue('task1', 1);
        expect(() => pq.enqueue('task1', 2)).toThrow('Item already exists in queue');
        expect(() => pq.updatePriority('task2', 1)).toThrow('Item not found in queue');
    });

    test('should maintain correct size', () => {
        const pq = new PriorityQueue<string>();
        expect(pq.size()).toBe(0);

        pq.enqueue('task1', 1);
        pq.enqueue('task2', 2);
        expect(pq.size()).toBe(2);

        pq.dequeue();
        expect(pq.size()).toBe(1);
    });

    test('should check item existence', () => {
        const pq = new PriorityQueue<string>();
        pq.enqueue('task1', 1);

        expect(pq.has('task1')).toBe(true);
        expect(pq.has('task2')).toBe(false);
    });

    test('should get item priority', () => {
        const pq = new PriorityQueue<string>();
        pq.enqueue('task1', 1);
        pq.enqueue('task2', 2);

        expect(pq.getPriority('task1')).toBe(1);
        expect(pq.getPriority('task2')).toBe(2);
        expect(() => pq.getPriority('task3')).toThrow('Item not found in queue');
    });

    test('should handle multiple priority updates', () => {
        const pq = new PriorityQueue<string>();
        pq.enqueue('task1', 1);
        pq.enqueue('task2', 2);
        pq.enqueue('task3', 3);

        pq.updatePriority('task1', 4);
        pq.updatePriority('task2', 5);
        pq.updatePriority('task3', 0);

        expect(pq.dequeue()).toBe('task2');
        expect(pq.dequeue()).toBe('task1');
        expect(pq.dequeue()).toBe('task3');
    });

    test('should handle non-number priorities', () => {
        const pq = new PriorityQueue<string, string>((a, b) => b.localeCompare(a));
        pq.enqueue('task1', 'high');
        pq.enqueue('task2', 'low');
        pq.enqueue('task3', 'medium');

        expect(pq.dequeue()).toBe('task2'); // 'low' comes last alphabetically
        expect(pq.dequeue()).toBe('task3'); // 'medium'
        expect(pq.dequeue()).toBe('task1'); // 'high' comes first alphabetically
    });
});
