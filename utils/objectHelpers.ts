/**
 * Utility functions for object transformations
 */

/**
 * Converts a flattened object with dot-notation keys to a nested object
 *
 * Example:
 * Input: { "user.name": "John", "user.age": 30, "user.address.city": "Paris" }
 * Output: { user: { name: "John", age: 30, address: { city: "Paris" } } }
 *
 * Supports both object and array notation:
 * - "user.0.name" will create an array at index 0
 * - "user.address.city" will create nested objects
 *
 * @param flat - Flattened object with dot-notation keys
 * @returns Nested object with proper structure
 */
export function unflattenDotObject(flat: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [path, value] of Object.entries(flat)) {
        // If no dot in path, add directly to result
        if (!path.includes(".")) {
            result[path] = value;
            continue;
        }

        const keys = path.split(".");
        let current = result;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const isLast = i === keys.length - 1;
            const nextKey = keys[i + 1];

            if (isLast) {
                // Last key: assign the value
                current[key] = value;
                break;
            }

            // Not last key: create nested structure if needed
            if (!(key in current)) {
                // Determine if next level should be array or object
                // If next key is a number, create an array
                current[key] = isFinite(Number(nextKey)) ? [] : {};
            }

            // Move to next level
            current = current[key] as Record<string, unknown>;
        }
    }

    return result;
}

/**
 * Flattens a nested object into dot-notation keys
 * This is the reverse operation of unflattenDotObject
 *
 * Example:
 * Input: { user: { name: "John", address: { city: "Paris" } } }
 * Output: { "user.name": "John", "user.address.city": "Paris" }
 *
 * @param obj - Nested object to flatten
 * @param prefix - Internal parameter for recursion (leave empty when calling)
 * @returns Flattened object with dot-notation keys
 */
export function flattenObject(
    obj: Record<string, unknown>,
    prefix = ""
): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (value && typeof value === "object" && !Array.isArray(value)) {
            // Recursively flatten nested objects
            Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
        } else if (Array.isArray(value)) {
            // Convert arrays to comma-separated strings
            result[newKey] = value.join(", ");
        } else {
            // Primitive values
            result[newKey] = value;
        }
    }

    return result;
}
