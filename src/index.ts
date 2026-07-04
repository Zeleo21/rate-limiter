import logger from "./logger/logger.ts";
import {RateLimitingHelper} from "./algorithms/helper.ts";

const main = async () => {
    const args = process.argv.slice(2);
    if (!args.length){
        logger.warn("No arguments provided, Usage: --algo XXXX");
        throw new Error("please provide an argument");
    }
    if(!RateLimitingHelper.isValidAlgorithm(args[0])) {
        logger.info("Usage: --algo token_bucket, leaky_bucket, fixed_window, sliding_window, tb, lb, fw, sw");
        throw new Error("invalid arguments");
    }
    logger.info(`Will proceed to execute following algorithm : ${args[0]}`)
    return 0;
}

main().then((status) => {
    logger.info(`--------------------- Executed rate-limiting program, exited with status --------------------- ${status}`);
}).catch((error) => {
    logger.error(`--------------------- Error in the rate-limiting program --------------------- ${error}`);
})