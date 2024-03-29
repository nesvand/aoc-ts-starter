export const isNumber = (n: unknown): n is number => typeof n === 'number';

/**
 * Returns the remainder of a division. Unlike the modulo operator, this function
 * always returns a positive number.
 * @example mod(-1, 10) // 9
 */
export const mod = (n: number, m: number): number => ((n % m) + m) % m;

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
export const lerp = (start: number, end: number, percent: number): number => start + (end - start) * percent;

/**
 * Linear interpolation between two angles.
 * @example lerpAngle(0, Math.PI, 0.5) // Math.PI / 2
 */
export const lerpAngle = (start: number, end: number, percent: number): number => {
    const naive = Math.abs(lerp(start, end, percent));
    if (naive > Math.PI) {
        return mod(naive, Math.PI);
    }

    return naive;
};

/**
 * Maps a number from one range to another.
 * @example mapRange(5, 0, 10, 0, 100) // 50
 * @example mapRange(5, 0, 10, 0, 5) // 2.5
 * @example mapRange(5, 0, 10, 100, 0) // 50
 */
export const mapRange = (value: number, fromStart: number, fromEnd: number, toStart: number, toEnd: number): number => {
    return ((value - fromStart) / (fromEnd - fromStart)) * (toEnd - toStart) + toStart;
};
