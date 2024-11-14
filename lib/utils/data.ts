export class RingBuffer<T> {
    private _buffer: T[];
    private _size: number;
    private _pointer: number;

    constructor(size: number) {
        if (size <= 0) {
            throw new Error('Buffer size must be greater than 0');
        }
        this._buffer = new Array<T>(size);
        this._size = size;
        this._pointer = 0;
    }

    public push(item: T): void {
        if (item === undefined) {
            throw new Error('Cannot push undefined value to buffer');
        }
        this._buffer[this._pointer] = item;
        this._pointer = (this._pointer + 1) % this._size;
    }

    public get(index: number): T {
        if (index < 0 || index >= this._size) {
            throw new Error('Index out of bounds');
        }
        const item = this._buffer[index];
        if (item === undefined) {
            throw new Error('No element at specified index');
        }
        return item;
    }

    public peek(): T | undefined {
        const index = this._pointer === 0 ? this._size - 1 : this._pointer - 1;
        return this._buffer[index];
    }

    public clear(newSize?: number): void {
        if (newSize !== undefined) {
            if (newSize <= 0) {
                throw new Error('Buffer size must be greater than 0');
            }
            this._size = newSize;
        }
        this._buffer = new Array<T>(this._size);
        this._pointer = 0;
    }

    public get isFull(): boolean {
        let count = 0;
        for (let i = 0; i < this._size; i++) {
            if (this._buffer[i] !== undefined) count++;
        }
        return count === this._size;
    }

    public toArray(): T[] {
        if (!this.isFull) {
            const result = [];
            const start = this._pointer;
            for (let i = 0; i < this._size; i++) {
                const idx = (start + i) % this._size;
                const item = this._buffer[idx];
                if (item !== undefined) result.push(item);
            }
            return result;
        }
        const result = new Array<T>(this._size);
        const start = this._pointer === 0 ? this._pointer : (this._pointer - 1 + this._size) % this._size;
        for (let i = 0; i < this._size; i++) {
            const idx = (start + i) % this._size;
            result[i] = this._buffer[idx] as T;
        }
        return result;
    }

    public *[Symbol.iterator](): Iterator<T> {
        if (!this.isFull) {
            for (let i = 0; i < this._pointer; i++) {
                if (this._buffer[i] !== undefined) yield this._buffer[i] as T;
            }
        } else {
            const start = this._pointer === 0 ? this._pointer : (this._pointer - 1 + this._size) % this._size;
            for (let i = 0; i < this._size; i++) {
                const idx = (start + i) % this._size;
                yield this._buffer[idx] as T;
            }
        }
    }

    public get size(): number {
        return this._size;
    }

    public get capacity(): number {
        return this._size;
    }

    public get pointer(): number {
        return this._pointer;
    }
}
