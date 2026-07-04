import {
    rateLimitingAlgorithms,
    rateLimitingAlgorithmsAliases,
} from "./constants.ts";


export class RateLimitingHelper {
    public static isValidAlgorithm(algorithmName: string): boolean {
        return rateLimitingAlgorithms.some((algo) => algorithmName === algo)
        || rateLimitingAlgorithmsAliases.some((algo) => algorithmName === algo);
    }
}