import {IRateLimitingAlgorithm} from "./rate-limiting-algorithm.ts";
import logger from "../logger/logger.ts";
import {RateLimitingHelper} from "./helper.ts";


export class SlidingWindowLog implements IRateLimitingAlgorithm{
    private readonly windowSize: number;
    private readonly maxRequestsPerWindow: number;
    private currentRequestTimeStamps: number[];

    constructor(windowSize: number = (60 * 1000), maxRequestsPerWindow: number = 100) {
        this.windowSize = windowSize;
        this.maxRequestsPerWindow = maxRequestsPerWindow;
        this.currentRequestTimeStamps = [];
    }

    allowRequest(timeStamp: number = Date.now()): boolean {
        this.currentRequestTimeStamps = this.currentRequestTimeStamps.filter((tm) => tm > timeStamp - this.windowSize);
        if (this.currentRequestTimeStamps.length > this.maxRequestsPerWindow) {
            return false;
        }
        this.currentRequestTimeStamps.push(timeStamp);
        return true;
    }

    getRemainingRequests(timestamp: number = Date.now()): number {
        const validCount = this.currentRequestTimeStamps.filter((tm) => tm > timestamp - this.windowSize).length;
        return this.maxRequestsPerWindow - validCount;
    }

    getResetAt(timestamp: number = Date.now()): number {
        if (this.currentRequestTimeStamps.length === 0) {
            return timestamp;
        }
        const oldestTimestamp = Math.min(...this.currentRequestTimeStamps);
        return oldestTimestamp + this.windowSize;
    }

    async simulateAlgorithm(sleepTime: number): Promise<void> {
        while (true) {
            const now = Date.now();
            const defaultInformation = {
                currentTimeStamp: now,
                currentRequestTimeStamps: this.currentRequestTimeStamps.length,
                maxRequestsPerWindow: this.maxRequestsPerWindow,
            };
            if (this.allowRequest()) {
                logger.info(defaultInformation,'Information about current state');
                await RateLimitingHelper.sleep(sleepTime);
            } else {
                logger.warn( 'Sliding window log algorithm limit reached');
                await RateLimitingHelper.sleep(sleepTime);
            }
        }
    }

}