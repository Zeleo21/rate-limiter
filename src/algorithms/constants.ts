export enum RateLimitingAlgorithm {
    TOKEN_BUCKET = "token_bucket",
    LEAKY_BUCKET = "leaky_bucket",
    FIXED_WINDOW = "fixed_window",
    SLIDING_WINDOW = "sliding_window",
}

export enum RateLimitingAlias {
    TOKEN_BUCKET = "tb",
    LEAKY_BUCKET = "lb",
    FIXED_WINDOW = "fw",
    SLIDING_WINDOW = "sw",
}


export const rateLimitingAlgorithms = Object.values(RateLimitingAlgorithm);
export const rateLimitingAlgorithmsAliases = Object.values(RateLimitingAlias);
