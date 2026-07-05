import logger from "../logger/logger.ts";
import { IRateLimitingAlgorithm } from "./rate-limiting-algorithm.ts";
import {RateLimitingHelper} from "./helper.ts";

export class FixedWindow implements IRateLimitingAlgorithm {
    private readonly windowSize: number;
    private readonly maxRequestsPerWindow: number;
    private currentRequests: number;
    private windowStart: number;

    constructor(windowSize: number = (60 * 1000), maxRequestsPerWindow: number = 100) {
        this.windowSize = windowSize;
        this.maxRequestsPerWindow = maxRequestsPerWindow;
        this.currentRequests = 0;
        this.windowStart = Date.now();
    }

    private resetRequestCounter(): void {
        this.currentRequests = 0;
    }

    private resetWindowStart(): void {
        this.windowStart = Date.now()
    }

    public getResetAt(timestamp: number = Date.now()): number {
        if (timestamp - this.windowStart >= this.windowSize) {
            return timestamp + this.windowSize;
        }
        return this.windowStart + this.windowSize;
    }

    public allowRequest(timestamp: number = Date.now()): boolean {
        if (timestamp - this.windowStart >= this.windowSize) {
            this.resetRequestCounter();
            this.resetWindowStart();
        }
        if (this.getRemainingRequests(timestamp) > 0) {
            this.currentRequests++;
            return true;
        } else {
            return false;
        }
    }

    public getRemainingRequests(timeStamp: number = Date.now()): number {
        if (timeStamp - this.windowStart >= this.windowSize) {
            return this.maxRequestsPerWindow;
        }
        return this.maxRequestsPerWindow - this.currentRequests;
    }

    public async simulateAlgorithm(sleepTime: number): Promise<void> {
        while (true) {
            const now = Date.now();
            const defaultInformation = {
                currentTimeStamp: now,
                currentRequests: this.currentRequests,
                timeUntilNextWindow: this.windowStart + this.windowSize - now,
                maxRequestsPerWindow: this.maxRequestsPerWindow,
            };
            if (this.allowRequest()) {
                logger.info(defaultInformation,'Information about current state');
                await RateLimitingHelper.sleep(sleepTime);
            } else {
                logger.warn('Fixed Window algorithm limit reached, please wait for next window before simulating');
                break;
            }
        }
    }
}