import {RateLimitingAlgorithm} from "./constants.ts";
import {FixedWindow} from "./fixed-window.ts";
import {SlidingWindowLog} from "./sliding-window-log.ts";


export interface IRateLimitingAlgorithm {
    allowRequest(timeStamp?: number): boolean
    getRemainingRequests(timestamp?: number): number
    getResetAt(timestamp?: number): number
    simulateAlgorithm(sleepTime: number): Promise<void>
}


export function createRateLimitingAlgorithm(rateLimiting: RateLimitingAlgorithm): IRateLimitingAlgorithm {
    switch (rateLimiting) {
        case RateLimitingAlgorithm.FIXED_WINDOW:
            return new FixedWindow();
        case RateLimitingAlgorithm.SLIDING_WINDOW:
            return new SlidingWindowLog()
        // TODO: add more algorithms
        default:
            throw new Error(`Unknown algorithm: ${rateLimiting}`);
    }
}