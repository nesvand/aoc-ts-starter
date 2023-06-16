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

type Choppers = typeof int | typeof word | typeof float;
type Chopped<C extends Choppers[]> = C extends [infer First extends Choppers, ...infer Rest extends Choppers[]]
    ? [ReturnType<ReturnType<First>>, ...Chopped<Rest>]
    : [];

export function extract<C extends Choppers[]>(parts: TemplateStringsArray, ...parsers: C) {
    return function (input: StringView): Chopped<C> {
        const result: any = [];
        for (let i = 0; i < parsers.length; i++) {
            input.chopByStringView(new StringView(parts[i]));
            const parser = parsers[i];
            if (!parser) throw new ReferenceError('Parser not found');
            result.push(parser()(input));
        }
        return result;
    };
}
