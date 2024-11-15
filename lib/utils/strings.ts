import { StringView, isWhitespace } from '@lib/string-view';

export function int() {
    return (sv: StringView) => {
        const result = sv.chopInt();
        if (!result.success) throw new Error('Failed to parse integer');
        return result.data;
    };
}

export function word() {
    return (sv: StringView) => {
        const out = sv.chopLeftWhile((c) => !isWhitespace(c));
        return out.toString();
    };
}

export function float() {
    return (sv: StringView) => {
        const result = sv.chopFloat();
        if (!result.success) throw new Error('Failed to parse float');
        return result.data;
    };
}

export function optional() {
    return (sv: StringView) => {
        if (isWhitespace(sv.charAt(0))) return '';
        return sv.chopLeft(1).toString();
    };
}

type Choppers = typeof int | typeof word | typeof float | typeof optional;
type Chopped<C extends Choppers[]> = C extends [infer First extends Choppers, ...infer Rest extends Choppers[]]
    ? [ReturnType<ReturnType<First>>, ...Chopped<Rest>]
    : [];

export function extract<C extends Choppers[]>(parts: TemplateStringsArray, ...parsers: C) {
    return (input: StringView): Chopped<C> => {
        const result: unknown[] = [];
        for (let i = 0; i < parsers.length; i++) {
            const part = parts[i];
            if (part === undefined) throw new ReferenceError('Part not found');
            input.chopByStringView(new StringView(part));
            const parser = parsers[i];
            if (parser === undefined) throw new ReferenceError('Parser not found');
            result.push(parser()(input));
        }
        return result as Chopped<C>;
    };
}
