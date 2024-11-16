import { describe, expect, test } from 'bun:test';
import { BinaryHeap } from '@lib/data';

describe('BinaryHeap', () => {
    test('should maintain max-heap property', () => {
        const heap = new BinaryHeap<number>((a, b) => a - b);
        heap.push(1);
        heap.push(3);
        heap.push(2);

        expect(heap.peek()).toBe(3);
        expect(heap.pop()).toBe(3);
        expect(heap.pop()).toBe(2);
        expect(heap.pop()).toBe(1);
        expect(heap.pop()).toBeUndefined();
    });

    test('should maintain min-heap property', () => {
        const heap = new BinaryHeap<number>((a, b) => b - a);
        heap.push(3);
        heap.push(1);
        heap.push(2);

        expect(heap.peek()).toBe(1);
        expect(heap.pop()).toBe(1);
        expect(heap.pop()).toBe(2);
        expect(heap.pop()).toBe(3);
    });

    test('should handle peek operations', () => {
        const heap = new BinaryHeap<number>((a, b) => a - b);
        expect(heap.peek()).toBeUndefined();

        heap.push(1);
        heap.push(3);
        heap.push(2);

        expect(heap.peek()).toBe(3);
        expect(heap.peek()).toBe(3); // Peek shouldn't remove the element
    });

    test('should track size correctly', () => {
        const heap = new BinaryHeap<number>((a, b) => a - b);
        expect(heap.size()).toBe(0);
        expect(heap.isEmpty()).toBe(true);

        heap.push(1);
        expect(heap.size()).toBe(1);
        expect(heap.isEmpty()).toBe(false);

        heap.pop();
        expect(heap.size()).toBe(0);
        expect(heap.isEmpty()).toBe(true);
    });

    test('should handle custom comparators', () => {
        interface Task {
            priority: number;
            name: string;
        }

        const heap = new BinaryHeap<Task>((a, b) => a.priority - b.priority);

        heap.push({ priority: 1, name: 'Low' });
        heap.push({ priority: 3, name: 'High' });
        heap.push({ priority: 2, name: 'Medium' });

        expect(heap.pop()?.name).toBe('High');
        expect(heap.pop()?.name).toBe('Medium');
        expect(heap.pop()?.name).toBe('Low');
    });

    test('should maintain heap property after multiple operations', () => {
        const heap = new BinaryHeap<number>((a, b) => a - b);
        const values = [5, 3, 8, 1, 2, 7, 4, 6];

        for (const value of values) {
            heap.push(value);
        }

        const sorted = [];
        while (!heap.isEmpty()) {
            const value = heap.pop();
            if (value !== undefined) {
                sorted.push(value);
            }
        }

        expect(sorted).toEqual([8, 7, 6, 5, 4, 3, 2, 1]);
    });

    test('should handle update operations', () => {
        const heap = new BinaryHeap<number>((a, b) => a - b);
        heap.push(1);
        heap.push(2);
        heap.push(3);

        const index = heap.push(4);
        heap.update(index, 0); // Update 4 to 0

        expect(heap.pop()).toBe(3);
        expect(heap.pop()).toBe(2);
        expect(heap.pop()).toBe(1);
        expect(heap.pop()).toBe(0);
    });

    test('should throw on invalid update index', () => {
        const heap = new BinaryHeap<number>((a, b) => a - b);
        expect(() => heap.update(-1, 1)).toThrow('Index out of bounds');
        expect(() => heap.update(0, 1)).toThrow('Index out of bounds');

        heap.push(1);
        expect(() => heap.update(1, 2)).toThrow('Index out of bounds');
    });
});
