export class RingBuffer<T> {
    private _buffer: T[];
    private readonly _size: number;
    private _pointer: number;

    constructor(size: number) {
        this._buffer = new Array<T>(size);
        this._size = size;
        this._pointer = 0;
    }

    public push(item: T) {
        this._buffer[this._pointer] = item;
        this._pointer = (this._pointer + 1) % this._size;
    }

    public get(index: number): T | undefined {
        return this._buffer[index];
    }

    public get size(): number {
        return this._size;
    }

    public get pointer(): number {
        return this._pointer;
    }
}
