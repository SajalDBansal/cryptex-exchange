import { createClient } from "redis";
import { pgPool } from "./dbManager";
import { DbMessage } from "./types";

const pgClient = pgPool;

async function main() {
    const redisClient = createClient();
    await redisClient.connect();
    console.log("Redis client connected");

    while (true) {
        const response = await redisClient.rPop("db_process" as string);
        if (!response) {

        } else {
            const data: DbMessage = JSON.parse(response);
            switch (data.type) {
                case "TRADE_ADDED":
                    console.log("adding trade");
                    const tradeQuery = `INSERT INTO trades (symbol, id, isBuyerMaker, price, quantity, quoteQuantity, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
                    const tradeValues = [
                        data.data.market,
                        data.data.id,
                        data.data.isBuyerMaker,
                        data.data.price,
                        data.data.quantity,
                        data.data.quoteQuantity,
                        data.data.timestamp,
                    ];
                    const priceQuery = `INSERT INTO prices (symbol, time, price) VALUES ($1, $2, $3)`;
                    const priceValues = [
                        data.data.market,
                        data.data.timestamp,
                        data.data.price,
                    ];
                    await pgClient.query(tradeQuery, tradeValues);
                    await pgClient.query(priceQuery, priceValues);
                    break;

                case "ORDER_UPDATE":
                    console.log("updating order");
                    const orderQuery = `INSERT INTO orders (orderId, executedQty, market, price, quantity, side) VALUES ($1, $2, $3, $4, $5, $6)`;
                    const orderValues = [
                        data.data.orderId,
                        data.data.executedQty,
                        data.data.market,
                        data.data.price,
                        data.data.quantity,
                        data.data.side,
                    ];
                    await pgClient.query(orderQuery, orderValues);
                    break;

                case "TICKERS_UPDATE":
                    console.log("updating tickers");
                    const tickersQuery = `INSERT INTO tickers (symbol, firstPrice, high, lastPrice, low, priceChange, priceChangePercent, quoteVolume, volume, trades) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
                    const tickersValues = [
                        data.data.symbol,
                        data.data.firstPrice,
                        data.data.high,
                        data.data.lastPrice,
                        data.data.low,
                        data.data.priceChange,
                        data.data.priceChangePercent,
                        data.data.quoteVolume,
                        data.data.volume,
                        data.data.trades,
                    ];
                    await pgClient.query(tickersQuery, tickersValues);
                    break;
            }
        }
    }
}