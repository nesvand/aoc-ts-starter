import { RingBuffer } from '@lib/utils/data';
describe('@lib/utils/data', () => {
    describe('RingBuffer', () => {
        let buffer: RingBuffer<number>;

        beforeEach(() => {
            buffer = new RingBuffer<number>(3);
        });

        test('should have a size', () => {
            expect(buffer.size).toBe(3);
        });

        test('should have a pointer', () => {
            expect(buffer.pointer).toBe(0);
        });

        test('should push items', () => {
            buffer.push(1);
            buffer.push(2);
            buffer.push(3);
            buffer.push(4);
            expect(buffer.get(0)).toBe(4);
            expect(buffer.get(1)).toBe(2);
            expect(buffer.get(2)).toBe(3);
        });

        test('should get items', () => {
            buffer.push(1);
            buffer.push(2);
            buffer.push(3);
            expect(buffer.get(0)).toBe(1);
            expect(buffer.get(1)).toBe(2);
            expect(buffer.get(2)).toBe(3);
        });

        test('should get undefined for invalid index', () => {
            buffer.push(1);
            buffer.push(2);
            buffer.push(3);
            expect(buffer.get(3)).toBeUndefined();
        });
    });
});
