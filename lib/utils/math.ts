export const isNumber = (n: unknown): n is number => typeof n === 'number';

/**
 * Returns the remainder of a division. Unlike the modulo operator, this function
 * always returns a positive number.
 * @example mod(-1, 10) // 9
 */
export const mod = (n: number, m: number): number => {
    if (m === 0) throw new Error('Division by zero');
    return ((n % m) + m) % m;
};

/**
 * Clamps a number between a minimum and maximum value.
 * @example clamp(5, 0, 10) // 5
 * @example clamp(-5, 0, 10) // 0
 */
export const clamp = (n: number, min: number, max: number): number => Math.min(Math.max(n, min), max);

/**
 * Linear interpolation between two numbers.
 * @example lerp(0, 10, 0.5) // 5
 */
export const lerp = (start: number, end: number, percent: number): number => {
    if (percent === 0) return start;
    if (percent === 1) return end;
    return start + (end - start) * percent;
};

/**
 * Linear interpolation between two angles.
 * @example lerpAngle(0, Math.PI, 0.5) // Math.PI / 2
 */
export const lerpAngle = (start: number, end: number, percent: number): number => {
    if (percent === 0) return start;
    if (percent === 1 || percent === -1) return end;

    // Normalize the percent to [0, 1] range using mod instead of clamp
    const normalizedPercent = mod(percent, 1);

    // Normalize angles to [0, 2π]
    const normalizedStart = mod(start, Math.PI * 2);
    const normalizedEnd = mod(end, Math.PI * 2);

    // Find shortest angle
    let diff = normalizedEnd - normalizedStart;
    if (Math.abs(diff) > Math.PI) {
        if (normalizedEnd > normalizedStart) {
            diff -= Math.PI * 2;
        } else {
            diff += Math.PI * 2;
        }
    }

    return mod(normalizedStart + diff * normalizedPercent, Math.PI * 2);
};

/**
 * Maps a number from one range to another.
 * @example mapRange(5, 0, 10, 0, 100) // 50
 * @example mapRange(5, 0, 10, 0, 5) // 2.5
 * @example mapRange(5, 0, 10, 100, 0) // 50
 */
export const mapRange = (value: number, fromStart: number, fromEnd: number, toStart: number, toEnd: number): number => {
    // Cache division result to avoid recalculation
    const scale = (toEnd - toStart) / (fromEnd - fromStart);
    return (value - fromStart) * scale + toStart;
};
