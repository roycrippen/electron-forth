/**
 * These interfaces are to allow standardization among forth behavior.
 */

interface Callback {
    ( error: Error, result?: number ): void;
}

interface ForthOutputCallback {
    ( error: string, output: string ): void;
}