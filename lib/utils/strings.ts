import { isWhitespace, StringView } from '@lib/utils/string-view';

export function int() {
    return function (sv: StringView) {
        return sv.chopInt();
    };
}

export function word() {
    return function (sv: StringView) {
        const out = sv.chopLeftWhile((c) => !isWhitespace(c));
        return out.toString();
    };
}

export function float() {
    return function (sv: StringView) {
        return sv.chopFloat();
    };
}

export function optional() {
    return function (sv: StringView) {
        if (isWhitespace(sv.charAt(0))) return '';
        return sv.chopLeft(1).toString();
    };
}

type Choppers = typeof int | typeof word | typeof float | typeof optional;
type Chopped<C extends Choppers[]> = C extends [infer First extends Choppers, ...infer Rest extends Choppers[]]
    ? [ReturnType<ReturnType<First>>, ...Chopped<Rest>]
    : [];

export function extract<C extends Choppers[]>(parts: TemplateStringsArray, ...parsers: C) {
    return function (input: StringView): Chopped<C> {
        const result: any = [];
        for (let i = 0; i < parsers.length; i++) {
            const part = parts[i];
            if (part === undefined) throw new ReferenceError('Part not found');
            input.chopByStringView(new StringView(part));
            const parser = parsers[i];
            if (parser === undefined) throw new ReferenceError('Parser not found');
            result.push(parser()(input));
        }
        return result;
    };
}
