export function isWhitespace(char?: string) {
    if (char === undefined) {
        return false;
    }

    return (
        char === ' ' || char === '\n' || char === '\t' || char === '\r' || char === '\f' || char === '\v' || char === '\u00A0' || char === '\uFEFF'
    );
}

function isDigit(char?: string) {
    if (char === undefined) {
        return false;
    }
    return char >= '0' && char <= '9';
}

export class StringView {
    constructor(public data: string) {}

    static fromStringView(sv: StringView) {
        return new StringView(sv.data);
    }

    public charAt(index: number): string {
        return this.data.charAt(index);
    }

    public substr(start: number, length?: number) {
        return new StringView(this.data.substring(start, length));
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

        return this.substr(i);
    }

    public trimRight() {
        let i = 0;
        while (i < this.data.length && isWhitespace(this.charAt(this.data.length - i - 1))) {
            i++;
        }

        return this.substr(0, this.data.length - i);
    }

    public trim() {
        return this.trimLeft().trimRight();
    }

    public takeLeftWhile(predicate: (char?: string) => boolean) {
        let i = 0;
        while (i < this.data.length && predicate(this.data.charAt(i))) {
            i++;
        }

        return this.substr(0, i);
    }

    public chopLeft(size: number) {
        if (size > this.data.length) {
            size = this.data.length;
        }

        const result = this.substr(0, size);
        this.data = this.data.substring(size);

        return result;
    }

    public chopRight(size: number) {
        if (size > this.data.length) {
            size = this.data.length;
        }

        const result = this.substr(this.data.length - size);
        this.data = this.data.substring(0, this.data.length - size);

        return result;
    }

    public tryChopByDelimiter(delim: string) {
        let i = 0;
        while (i < this.data.length && this.data.charAt(i) !== delim) {
            i++;
        }

        const data = this.substr(0, i);

        if (i < this.data.length) {
            this.data = this.data.substring(i + 1);
            return { data, success: true };
        }

        return { success: false };
    }

    public chopByDelimiter(delim: string) {
        let i = 0;
        while (i < this.data.length && this.data.charAt(i) !== delim) {
            i++;
        }

        const result = this.substr(0, i);

        if (i < this.data.length) {
            this.data = this.data.substring(i + 1);
        } else {
            this.data = '';
        }

        return result;
    }

    public chopByStringView(delim: StringView) {
        let window = this.substr(0, delim.data.length);
        let i = 0;
        while (i + delim.data.length < this.data.length && !window.eq(delim)) {
            i++;
            window = this.substr(i, i + delim.data.length);
        }

        let result = this.substr(0, i);

        if (i + delim.data.length === this.data.length) {
            result = this.substr(0, i + delim.data.length);
        }

        this.data = this.data.substring(i + delim.data.length);

        return result;
    }

    public toInt() {
        let result = 0;

        for (let i = 0; i < this.data.length && isDigit(this.data.charAt(i)); i++) {
            result = result * 10 + parseInt(this.data.charAt(i));
        }

        return result;
    }

    public toFloat() {
        let result = 0.0;
        let decimal = 0.0;

        for (let i = 0; i < this.data.length; i++) {
            if (this.data.charAt(i) === '.') {
                decimal = 1.0;
            } else if (!isDigit(this.data.charAt(i))) {
                return result;
            } else {
                if (decimal > 0.0) {
                    decimal *= 0.1;
                    result += decimal * parseInt(this.data.charAt(i));
                } else {
                    result = result * 10 + parseInt(this.data.charAt(i));
                }
            }
        }

        return result;
    }

    public chopInt() {
        let i = 0;
        while (i < this.data.length && isDigit(this.data.charAt(i))) {
            i++;
        }

        const result = parseInt(this.substr(0, i).toString(), 10);

        this.data = this.data.substring(i);

        return result;
    }

    public chopFloat() {
        let i = 0;
        while (i < this.data.length && (isDigit(this.data.charAt(i)) || this.data.charAt(i) === '.')) {
            i++;
        }

        const result = parseFloat(this.substr(0, i).toString());

        this.data = this.data.substring(i);

        return result;
    }

    public chopLeftWhile(predicate: (char?: string) => boolean) {
        let i = 0;
        while (i < this.data.length && predicate(this.data.charAt(i))) {
            i++;
        }

        const result = this.substr(0, i);

        this.data = this.data.substring(i);

        return result;
    }
}
