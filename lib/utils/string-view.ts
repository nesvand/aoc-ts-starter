// Copyright 2021 Alexey Kutepov <reximkut@gmail.com>
// Copyright 2023 Andrew Nesvadba <nesvand@gmail.com>

// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

export function isWhitespace(char?: string): boolean {
    return Boolean(char?.match(/\s/));
}

export function isDigit(char?: string): boolean {
    return Boolean(char?.match(/^\d$/));
}

/**
 * A utility class for parsing a string in an immutable way. In general new memory is only allocated when the `data`
 * getter is accessed. It is by no means as efficient as accessing a constant char array in C, but it does ensure you can
 * work in a non-destructive way with strings.
 */
export class StringView {
    #source: string;
    #start = 0;
    #size: number;

    constructor(data: string) {
        this.#source = data;
        this.#size = data.length;
    }

    static fromStringView(sv: StringView) {
        const copy = new StringView('');
        copy.#source = sv.#source;
        copy.#start = sv.#start;
        copy.#size = sv.#size;

        return copy;
    }

    static fromParts(source: string, start: number, size: number) {
        const copy = new StringView('');
        copy.#source = source;
        copy.#start = start;
        copy.#size = size;

        return copy;
    }

    private get data() {
        return this.#source.substring(this.#start, this.#start + this.#size);
    }

    public charAt(index: number): string {
        return this.data[index] ?? '';
    }

    public indexOf(search: string): number {
        return this.data.indexOf(search);
    }

    public eq(other: StringView) {
        return this.data === other.data;
    }

    public eqIgnoreCase(other: StringView) {
        return this.data.toLowerCase() === other.data.toLowerCase();
    }

    public startsWith(search: StringView) {
        return this.data.startsWith(search.data);
    }

    public endsWith(search: StringView) {
        return this.data.endsWith(search.data);
    }

    public toString() {
        return this.data;
    }

    public trimLeft(): StringView {
        const trimCount = [...this.data].findIndex(char => !isWhitespace(char));
        return trimCount === -1 
            ? StringView.fromParts(this.#source, this.#start + this.#size, 0)
            : StringView.fromParts(this.#source, this.#start + trimCount, this.#size - trimCount);
    }

    public trimRight() {
        let i = 0;
        while (i < this.data.length && isWhitespace(this.charAt(this.data.length - i - 1))) {
            i++;
        }

        return StringView.fromParts(this.#source, this.#start, this.#size - i);
    }

    public trim() {
        return this.trimLeft().trimRight();
    }

    public takeLeftWhile(predicate: (char?: string) => boolean) {
        let i = 0;
        while (i < this.data.length && predicate(this.data.charAt(i))) {
            i++;
        }

        return StringView.fromParts(this.#source, this.#start, i);
    }

    public chopLeft(size: number): StringView {
        const actualSize = Math.min(size, this.data.length);
        const result = StringView.fromParts(this.#source, this.#start, actualSize);
        this.#start += actualSize;
        this.#size -= actualSize;
        return result;
    }

    public chopRight(size: number) {
        let _size = size;
        if (_size > this.data.length) {
            _size = this.data.length;
        }

        const result = StringView.fromParts(this.#source, this.#start + this.#size - _size, _size);
        this.#size -= _size;

        return result;
    }

    public tryChopByDelimiter(delim: string) {
        let i = 0;
        while (i < this.data.length && this.data.charAt(i) !== delim) {
            i++;
        }

        const data = StringView.fromParts(this.#source, this.#start, i);

        if (i < this.#size) {
            this.#start += i + 1;
            this.#size -= i + 1;
            return { data, success: true };
        }

        return { success: false };
    }

    public chopByDelimiter(delim: string) {
        let i = 0;
        while (i < this.data.length && this.data.charAt(i) !== delim) {
            i++;
        }

        const result = StringView.fromParts(this.#source, this.#start, i);

        if (i < this.#size) {
            this.#start += i + 1;
            this.#size -= i + 1;
        } else {
            this.#start += i;
            this.#size -= i;
        }

        return result;
    }

    public chopByStringView(delim: StringView) {
        const window = StringView.fromParts(this.#source, this.#start, delim.#size);
        let i = 0;
        while (i + delim.#size < this.#size && !window.eq(delim)) {
            i++;
            window.#start++;
        }

        const result = StringView.fromParts(this.#source, this.#start, i);

        if (i + delim.#size === this.#size) {
            result.#size += delim.#size;
        }

        this.#start += i + delim.#size;
        this.#size -= i + delim.#size;

        return result;
    }

    public toInt(): number {
        const firstChar = this.data.charAt(0);
        const sign = firstChar === '-' ? -1 : 1;
        const offset = ['-', '+'].includes(firstChar) ? 1 : 0;
        
        const digits = this.data.slice(offset).match(/^\d+/)?.[0] ?? '';
        return sign * [...digits].reduce((acc, digit) => acc * 10 + (Number.parseInt(digit) ?? 0), 0);
    }

    public toFloat() {
        let result = 0.0;
        let decimal = 0.0;
        let sign = 1;
        let offset = 0;
        if (this.data.charAt(0) === '-') {
            sign = -1;
            offset = 1;
        } else if (this.data.charAt(0) === '+') offset = 1;

        for (let i = 0 + offset; i < this.data.length; i++) {
            if (this.data.charAt(i) === '.') {
                decimal = 1.0;
            } else if (!isDigit(this.data.charAt(i))) {
                return result * sign;
            } else {
                if (decimal > 0.0) {
                    decimal *= 0.1;
                    result += decimal * Number.parseInt(this.data.charAt(i));
                } else {
                    result = result * 10 + Number.parseInt(this.data.charAt(i));
                }
            }
        }

        return result * sign;
    }

    public chopInt() {
        let sign = 1;
        if (this.data.charAt(0) === '-') {
            sign = -1;
            this.#start++;
            this.#size--;
        } else if (this.data.charAt(0) === '+') {
            this.#start++;
            this.#size--;
        }

        let result = 0;
        while (this.#size > 0 && isDigit(this.charAt(0))) {
            result = result * 10 + Number.parseInt(this.charAt(0));
            this.#start++;
            this.#size--;
        }

        return result * sign;
    }

    public chopFloat() {
        let sign = 1;
        if (this.data.charAt(0) === '-') {
            sign = -1;
            this.#start++;
            this.#size--;
        } else if (this.data.charAt(0) === '+') {
            this.#start++;
            this.#size--;
        }

        let result = 0.0;
        let decimal = 0.0;

        while (this.#size > 0) {
            if (this.charAt(0) === '.') {
                decimal = 1.0;
            } else if (!isDigit(this.charAt(0))) {
                return result * sign;
            } else {
                if (decimal > 0.0) {
                    decimal *= 0.1;
                    result += decimal * Number.parseInt(this.charAt(0));
                } else {
                    result = result * 10 + Number.parseInt(this.charAt(0));
                }
            }

            this.#start++;
            this.#size--;
        }

        return result * sign;
    }

    public chopLeftWhile(predicate: (char?: string) => boolean) {
        let i = 0;
        while (i < this.data.length && predicate(this.data.charAt(i))) {
            i++;
        }

        const result = StringView.fromParts(this.#source, this.#start, i);
        this.#start += i;
        this.#size -= i;

        return result;
    }

    get source() {
        return this.#source;
    }

    get start() {
        return this.#start;
    }

    get size() {
        return this.#size;
    }

    public *[Symbol.iterator](): Iterator<string> {
        for (let i = 0; i < this.size; i++) {
            yield this.charAt(i);
        }
    }
}
