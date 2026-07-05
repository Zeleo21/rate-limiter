import {
    RateLimitingAlgorithm,
    rateLimitingAlgorithms,
    rateLimitingAlgorithmsAliases, RateLimitingAlias,
} from "./constants.ts";


export class RateLimitingHelper {
    public static isValidAlgorithm(algorithmName: string): boolean {
        return rateLimitingAlgorithms.some((algo) => algorithmName === algo)
        || rateLimitingAlgorithmsAliases.some((algo) => algorithmName === algo);
    }

    public static convertStringToAlgorithm(algo: string): RateLimitingAlgorithm {
        if (algo === RateLimitingAlgorithm.FIXED_WINDOW || algo === RateLimitingAlias.FIXED_WINDOW) {
            return RateLimitingAlgorithm.FIXED_WINDOW;
        } else if (algo === RateLimitingAlgorithm.SLIDING_WINDOW || algo === RateLimitingAlias.SLIDING_WINDOW) {
            return RateLimitingAlgorithm.SLIDING_WINDOW;
        } else if (algo === RateLimitingAlgorithm.TOKEN_BUCKET || algo === RateLimitingAlgorithm.TOKEN_BUCKET) {
            return RateLimitingAlgorithm.TOKEN_BUCKET;
        } else if (algo === RateLimitingAlias.LEAKY_BUCKET || algo === RateLimitingAlias.LEAKY_BUCKET) {
            return RateLimitingAlgorithm.LEAKY_BUCKET;
        }
        throw new Error("please provide a valid algorithm");
    }

    public static sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}