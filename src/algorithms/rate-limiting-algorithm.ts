import {RateLimitingAlgorithm} from "./constants.ts";
import {FixedWindow} from "./fixed-window.ts";


export interface IRateLimitingAlgorithm {
    allowRequest(): boolean
    simulateAlgorithm(sleepTime: number): Promise<void>
}


export function createRateLimitingAlgorithm(rateLimiting: RateLimitingAlgorithm): IRateLimitingAlgorithm {
    switch (rateLimiting) {
        case RateLimitingAlgorithm.FIXED_WINDOW:
            return new FixedWindow();
        // TODO: add more algorithms
        default:
            throw new Error(`Unknown algorithm: ${rateLimiting}`);
    }
}