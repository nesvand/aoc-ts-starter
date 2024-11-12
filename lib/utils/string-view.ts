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

export function isWhitespace(char?: string) {
    if (char === undefined) {
        return false;
    }

    return (
        char === ' ' ||
        char === '\n' ||
        char === '\t' ||
        char === '\r' ||
        char === '\f' ||
        char === '\v' ||
        char === '\u00A0' ||
        char === '\uFEFF'
    );
}

export function isDigit(char?: string) {
    if (char === undefined) {
        return false;
    }
    return char >= '0' && char <= '9';
}

/**
 * A utility class for parsing a string in an immutable way. In general new memory is only allocated when the `data`
 * getter is accessed. It is by no means as efficient as accessing a constant char array in C, but it does ensure you can
 * work in a non-destructive way with strings.
 */
export class StringView {
    _source: { data: string };
    start = 0;
    size: number;

    constructor(data: string) {
        this._source = { data };
        this.size = data.length;
    }

    static fromStringView(sv: StringView) {
        const copy = new StringView('');
        copy._source = sv._source;
        copy.start = sv.start;
        copy.size = sv.size;

        return copy;
    }

    static fromParts(source: { data: string }, start: number, size: number) {
        const copy = new StringView('');
        copy._source = source;
        copy.start = start;
        copy.size = size;

        return copy;
    }

    private get data() {
        return this._source.data.substring(this.start, this.start + this.size);
    }

    public charAt(index: number): string {
        return this.data.charAt(index);
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

    public trimLeft() {
        let i = 0;
        while (i < this.data.length && isWhitespace(this.charAt(i))) {
            i++;
        }

        return StringView.fromParts(this._source, this.start + i, this.size - i);
    }

    public trimRight() {
        let i = 0;
        while (i < this.data.length && isWhitespace(this.charAt(this.data.length - i - 1))) {
            i++;
        }

        return StringView.fromParts(this._source, this.start, this.size - i);
    }

    public trim() {
        return this.trimLeft().trimRight();
    }

    public takeLeftWhile(predicate: (char?: string) => boolean) {
        let i = 0;
        while (i < this.data.length && predicate(this.data.charAt(i))) {
            i++;
        }

        return StringView.fromParts(this._source, this.start, i);
    }

    public chopLeft(size: number) {
        let _size = size;
        if (_size > this.data.length) {
            _size = this.data.length;
        }

        const result = StringView.fromParts(this._source, this.start, _size);
        this.start += _size;
        this.size -= _size;

        return result;
    }

    public chopRight(size: number) {
        let _size = size;
        if (_size > this.data.length) {
            _size = this.data.length;
        }

        const result = StringView.fromParts(this._source, this.start + this.size - _size, _size);
        this.size -= _size;

        return result;
    }

    public tryChopByDelimiter(delim: string) {
        let i = 0;
        while (i < this.data.length && this.data.charAt(i) !== delim) {
            i++;
        }

        const data = StringView.fromParts(this._source, this.start, i);

        if (i < this.size) {
            this.start += i + 1;
            this.size -= i + 1;
            return { data, success: true };
        }

        return { success: false };
    }

    public chopByDelimiter(delim: string) {
        let i = 0;
        while (i < this.data.length && this.data.charAt(i) !== delim) {
            i++;
        }

        const result = StringView.fromParts(this._source, this.start, i);

        if (i < this.size) {
            this.start += i + 1;
            this.size -= i + 1;
        } else {
            this.start += i;
            this.size -= i;
        }

        return result;
    }

    public chopByStringView(delim: StringView) {
        const window = StringView.fromParts(this._source, this.start, delim.size);
        let i = 0;
        while (i + delim.size < this.size && !window.eq(delim)) {
            i++;
            window.start++;
        }

        const result = StringView.fromParts(this._source, this.start, i);

        if (i + delim.size === this.size) {
            result.size += delim.size;
        }

        this.start += i + delim.size;
        this.size -= i + delim.size;

        return result;
    }

    public toInt() {
        let result = 0;
        let sign = 1;
        let offset = 0;
        if (this.data.charAt(0) === '-') {
            sign = -1;
            offset = 1;
        } else if (this.data.charAt(0) === '+') offset = 1;

        for (let i = 0 + offset; i < this.data.length && isDigit(this.data.charAt(i)); i++) {
            result = result * 10 + Number.parseInt(this.data.charAt(i));
        }

        return result * sign;
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
            this.start++;
            this.size--;
        } else if (this.data.charAt(0) === '+') {
            this.start++;
            this.size--;
        }

        let result = 0;
        while (this.size > 0 && isDigit(this.charAt(0))) {
            result = result * 10 + Number.parseInt(this.charAt(0));
            this.start++;
            this.size--;
        }

        return result * sign;
    }

    public chopFloat() {
        let sign = 1;
        if (this.data.charAt(0) === '-') {
            sign = -1;
            this.start++;
            this.size--;
        } else if (this.data.charAt(0) === '+') {
            this.start++;
            this.size--;
        }

        let result = 0.0;
        let decimal = 0.0;

        while (this.size > 0) {
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

            this.start++;
            this.size--;
        }

        return result * sign;
    }

    public chopLeftWhile(predicate: (char?: string) => boolean) {
        let i = 0;
        while (i < this.data.length && predicate(this.data.charAt(i))) {
            i++;
        }

        const result = StringView.fromParts(this._source, this.start, i);
        this.start += i;
        this.size -= i;

        return result;
    }
}
