import logger from "./logger/logger.ts";
import {RateLimitingHelper} from "./algorithms/helper.ts";
import { createRateLimitingAlgorithm } from "./algorithms/rate-limiting-algorithm.ts";

const main = async () => {
    const args = process.argv.slice(2);
    if (!args.length){
        logger.warn("No arguments provided, Usage: --algo XXXX --sleep XXXX");
        throw new Error("please provide an argument");
    }
    if(!RateLimitingHelper.isValidAlgorithm(args[0])) {
        logger.info("Usage: --algo token_bucket, leaky_bucket, fixed_window, sliding_window, tb, lb, fw, sw");
        throw new Error("invalid arguments");
    }
    if (args.length > 1 && !Number(args[1])) {
        throw new Error("invalid arguments provided, please provide a valid number for sleep");
    }
    const sleepTime = parseInt(args[1]) || 100;
    logger.info(`Will proceed to execute following algorithm : ${args[0]}`)
    const rateLimitingAlgorithmInstance = createRateLimitingAlgorithm(RateLimitingHelper.convertStringToAlgorithm(args[0]));
    await rateLimitingAlgorithmInstance.simulateAlgorithm(sleepTime);
    return 0;
}

main().then((status) => {
    logger.info(`--------------------- Executed rate-limiting program, exited with status --------------------- ${status}`);
}).catch((error) => {
    logger.error(`--------------------- Error in the rate-limiting program --------------------- ${error}`);
})