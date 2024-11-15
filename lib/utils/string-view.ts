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
        const str = this.data;
        if (index < 0 || index >= str.length) return '';

        const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
        const segments = [...segmenter.segment(str)];
        return segments[index]?.segment ?? '';
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
        const trimCount = [...this.data].findIndex((char) => !isWhitespace(char));
        return trimCount === -1
            ? StringView.fromParts(this.#source, this.#start + this.#size, 0)
            : StringView.fromParts(this.#source, this.#start + trimCount, this.#size - trimCount);
    }

    public trimRight() {
        const str = this.data;
        const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
        const segments = [...segmenter.segment(str)];

        let i = segments.length - 1;
        while (i >= 0) {
            const segment = segments[i];
            if (!segment || !isWhitespace(segment.segment)) {
                break;
            }
            i--;
        }

        // Calculate the new size based on the last non-whitespace character
        const lastSegment = segments[i];
        const newSize = lastSegment ? lastSegment.index + lastSegment.segment.length : 0;
        return StringView.fromParts(this.#source, this.#start, newSize);
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
        const str = this.data;
        const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
        const segments = [...segmenter.segment(str)];

        // Handle negative and overflow cases
        if (size <= 0) {
            return StringView.fromParts(this.#source, this.#start, 0);
        }
        
        // If size exceeds available segments, take everything
        if (size >= segments.length) {
            const result = StringView.fromStringView(this);
            this.#start += this.#size;
            this.#size = 0;
            return result;
        }

        // Calculate byte offset for the requested number of graphemes
        const actualSize = Math.min(size, segments.length);
        const byteOffset = (segments[actualSize - 1]?.index ?? 0) + 
                          (segments[actualSize - 1]?.segment.length ?? 0);

        const result = StringView.fromParts(this.#source, this.#start, byteOffset);
        this.#start += byteOffset;
        this.#size -= byteOffset;
        return result;
    }

    public chopRight(size: number): StringView {
        const str = this.data;
        const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
        const segments = [...segmenter.segment(str)];

        // Handle negative and overflow cases
        if (size <= 0) {
            return StringView.fromParts(this.#source, this.#start, 0);
        }
        
        // If size exceeds available segments, take everything
        if (size >= segments.length) {
            const result = StringView.fromStringView(this);
            this.#start += this.#size;
            this.#size = 0;
            return result;
        }

        // Calculate byte offset for the requested number of graphemes from the end
        const startSegment = segments[segments.length - size];
        if (!startSegment) {
            return StringView.fromParts(this.#source, this.#start, 0);
        }

        const byteOffset = startSegment.index;
        const result = StringView.fromParts(this.#source, this.#start + byteOffset, this.#size - byteOffset);
        this.#size = byteOffset;
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

    public chopByDelimiter(delim: string): StringView {
        const str = this.data;
        const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
        const segments = [...segmenter.segment(str)];
        
        // Get delimiter graphemes
        const delimSegments = [...segmenter.segment(delim)];
        const delimLength = delimSegments.length;

        // Find where the delimiter starts
        let i = 0;
        while (i < segments.length) {
            // Check if current position could be the start of the delimiter
            const remainingSegments = segments.slice(i);
            const potentialDelim = remainingSegments
                .slice(0, delimLength)  // Take enough segments for the delimiter
                .map(s => s.segment)
                .join('');
            
            if (potentialDelim === delim) {
                // Found the delimiter
                const upToDelim = segments.slice(0, i);
                if (upToDelim.length === 0) {
                    // Delimiter is at start
                    const result = StringView.fromParts(this.#source, this.#start, 0);
                    const afterDelim = segments[i + delimLength];
                    if (!afterDelim) {
                        this.#start = this.#start + this.#size;
                        this.#size = 0;
                        return result;
                    }
                    this.#start += afterDelim.index;
                    this.#size -= afterDelim.index;
                    return result;
                }
                // Create result up to delimiter
                const segment = segments[i];
                if (!segment) {
                    throw new Error('Invalid segment index when creating StringView');
                }
                const result = StringView.fromParts(this.#source, this.#start, segment.index);

                // Move past delimiter
                const afterDelim = segments[i + delimLength];
                if (!afterDelim) {
                    this.#start += this.#size;
                    this.#size = 0;
                } else {
                    this.#start += afterDelim.index;
                    this.#size -= afterDelim.index;
                }

                return result;
            }
            i++;
        }

        // Delimiter not found, return entire string
        const result = StringView.fromParts(this.#source, this.#start, this.#size);
        this.#start += this.#size;
        this.#size = 0;
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

    public toFloat(): number {
        let result = 0.0;
        let sign = 1;
        let offset = 0;

        // Handle sign
        if (this.data.charAt(0) === '-') {
            sign = -1;
            offset = 1;
        } else if (this.data.charAt(0) === '+') {
            offset = 1;
        }

        let foundDecimal = false;
        let decimalPlace = 0.1; // Start at first decimal place

        for (let i = offset; i < this.data.length; i++) {
            const char = this.data.charAt(i);

            if (char === '.' && !foundDecimal) {
                foundDecimal = true;
                continue;
            }

            if (!isDigit(char)) {
                break; // Stop at first non-digit
            }

            const digit = Number.parseInt(char);
            if (foundDecimal) {
                result += digit * decimalPlace;
                decimalPlace *= 0.1;
            } else {
                result = result * 10 + digit;
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
        const chars = Array.from(this.data);
        for (const char of chars) {
            yield char;
        }
    }
}
