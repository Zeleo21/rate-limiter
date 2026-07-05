import logger from "../logger/logger.ts";
import { IRateLimitingAlgorithm } from "./rate-limiting-algorithm.ts";
import {RateLimitingHelper} from "./helper.ts";

export class FixedWindow implements IRateLimitingAlgorithm {
    private readonly windowSize: number;
    private readonly maxRequestsPerWindow: number;
    private currentRequests: number;
    private windowStart: Date

    constructor(windowSize: number = (5 * 1000), maxRequestsPerWindow: number = 100) {
        this.windowSize = windowSize;
        this.maxRequestsPerWindow = maxRequestsPerWindow;
        this.currentRequests = 0;
        this.windowStart = new Date();
    }

    private resetRequestCounter(): void {
        this.currentRequests = 0;
    }

    private resetWindowStart(): void {
        this.windowStart = new Date();
    }

    public allowRequest(): boolean {
        const now = new Date(Date.now());
        // We have passed onto a new window
        if (now.getTime() - this.windowStart.getTime() >= this.windowSize) {
            this.resetRequestCounter();
            this.resetWindowStart();
        }
        if (this.getNumberOfAvailableRequestsInTimeWindow() > 0) {
            this.currentRequests++;
            return true;
        } else {
            return false;
        }
    }

    public getNumberOfAvailableRequestsInTimeWindow(): number {
        return this.maxRequestsPerWindow - this.currentRequests;
    }

    public async simulateAlgorithm(sleepTime: number): Promise<void> {
        while (true) {
            const now = new Date(Date.now());
            const defaultInformation = {
                currentTimeStamp: now.getTime(),
                currentDate: now,
                currentRequests: this.currentRequests,
                timeUntilNextWindow: this.windowStart.getTime() + this.windowSize - now.getTime(),
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