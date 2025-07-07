import { Router } from "express";
import { pgPool } from "../dbManager";

export const kLineRouter = Router();

kLineRouter.get("/", async (req, res) => {
    const { market, interval, startTime, endTime } = req.query;
    let query;
    switch (interval) {
        case "1m":
            query = `SELECT * FROM k_lines_1m WHERE market = $1 AND bucket >= $2 AND bucket <= $3`;
            break;
        case "15m":
            query = `SELECT * FROM k_lines_15m WHERE market = $1 AND bucket >= $2 AND bucket <= $3`;
            break;
        case "1h":
            query = `SELECT * FROM k_lines_1h WHERE market = $1 AND bucket >= $2 AND bucket <= $3`;
            break;
        case "1w":
            query = `SELECT * FROM k_lines_1w WHERE market = $1 AND bucket >= $2 AND bucket <= $3`;
            break;
        default:
            res.status(400).send("Invalid interval");
            return;
    }

    try {
        // Validate and parse startTime and endTime
        if (
            typeof market !== "string" ||
            typeof startTime !== "string" ||
            typeof endTime !== "string"
        ) {
            res.status(400).send("Missing or invalid query parameters");
            return;
        }

        const startTimestamp = Number(startTime);
        const endTimestamp = Number(endTime);

        if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
            res.status(400).send("Invalid startTime or endTime");
            return;
        }

        const startDate = new Date(startTimestamp * 1000);
        const endDate = new Date(endTimestamp * 1000);

        const result = await pgPool.query(query, [market, startDate, endDate]);
        res.json(result.rows.map(x => ({
            close: x.close,
            end: x.bucket,
            high: x.high,
            low: x.low,
            open: x.open,
            quoteVolume: x.quoteVolume,
            start: x.start,
            trades: x.trades,
            volume: x.volume,
        })));

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
});