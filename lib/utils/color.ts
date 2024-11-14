import * as math from '@lib/utils/math';

export interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
}

export const lerpColor = (a: Color, b: Color, t: number): Color => {
    const r = math.lerp(a.r, b.r, t);
    const g = math.lerp(a.g, b.g, t);
    const bl = math.lerp(a.b, b.b, t);
    const a_ = math.lerp(a.a, b.a, t);
    return { r, g, b: bl, a: a_ };
};

export const colorToHex = (color: Color): number => {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    const a = Math.round(color.a * 255);
    return a * (1 << 24) + ((r << 16) | (g << 8) | b);
};

export const hexToColor = (hex: number): Color => {
    const a = (hex >> 24) & 0xff;
    const r = (hex >> 16) & 0xff;
    const g = (hex >> 8) & 0xff;
    const b = hex & 0xff;
    return { r: r / 255, g: g / 255, b: b / 255, a: a / 255 };
};

export const colorToRGBAString = (color: Color): string => {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    const a = Math.round(color.a * 255);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const colorToRGBString = (color: Color): string => {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    return `rgb(${r}, ${g}, ${b})`;
};

export const colorToHexString = (color: Color): string => {
    const hex = colorToHex(color);
    return `#${hex.toString(16).slice(-6).padStart(6, '0')}`;
};

export const hexStringToColor = (hex: string): Color => {
    const removeHash = hex.replace('#', '');
    const hexWithAlpha = `ff${removeHash}`;
    const hexNumber = Number.parseInt(hexWithAlpha, 16);
    return hexToColor(hexNumber);
};
