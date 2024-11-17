import { BinaryHeap } from './binary-heap';

/**
 * A Priority Queue implementation that supports priority updates.
 * Uses a binary heap internally with a Map for O(1) element lookup.
 *
 * @template T The type of elements stored in the queue
 * @template P The type of priority values (number by default)
 */
export class PriorityQueue<T, P = number> {
    private heap: BinaryHeap<{ item: T; priority: P }>;
    private positions: Map<T, number>;

    constructor(
        comparator: (a: P, b: P) => number = (a: P, b: P) => {
            if (typeof a === 'number' && typeof b === 'number') {
                return a - b;
            }
            throw new Error('Custom comparator required for non-number priorities');
        },
    ) {
        this.positions = new Map();
        this.heap = new BinaryHeap<{ item: T; priority: P }>((a, b) => {
            const result = comparator(a.priority, b.priority);
            return result;
        });
    }

    public enqueue(item: T, priority: P): void {
        if (this.positions.has(item)) {
            throw new Error('Item already exists in queue');
        }

        const wrapper = {
            item,
            priority,
            onPositionChange: (newPos: number) => {
                this.positions.set(item, newPos);
            },
        };

        const index = this.heap.push(wrapper);
        this.positions.set(item, index);
    }

    public dequeue(): T {
        const node = this.heap.pop();
        if (!node) {
            throw new Error('Queue is empty');
        }

        this.positions.delete(node.item);
        return node.item;
    }

    public updatePriority(item: T, newPriority: P): void {
        const position = this.positions.get(item);
        if (position === undefined) {
            throw new Error('Item not found in queue');
        }

        const node = this.heap.get(position);
        if (!node) {
            throw new Error('Heap is corrupted');
        }

        this.heap.update(position, {
            item,
            priority: newPriority,
            onPositionChange: (newPos: number) => {
                this.positions.set(item, newPos);
            },
        });
    }

    public peek(): T {
        const node = this.heap.peek();
        if (!node) {
            throw new Error('Queue is empty');
        }
        return node.item;
    }

    public isEmpty(): boolean {
        return this.heap.isEmpty();
    }

    public size(): number {
        return this.heap.size();
    }

    public has(item: T): boolean {
        return this.positions.has(item);
    }

    public getPriority(item: T): P {
        const position = this.positions.get(item);
        if (position === undefined) {
            throw new Error('Item not found in queue');
        }

        const node = this.heap.get(position);
        if (!node) {
            throw new Error('Heap is corrupted');
        }

        return node.priority;
    }
}
