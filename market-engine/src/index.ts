import { createClient } from "redis";
import { Engine } from "./trades/Engine";

async function main() {
    const engine = new Engine();
    const redisClient = createClient();
    await redisClient.connect();
    console.log("Redis connected");

    while (true) {
        const response = await redisClient.rPop("message" as string);
        if (!response) {

        } else {
            const message = JSON.parse(response);
            engine.process(message);
        }
    }
}

main();