import { Router } from "express";
import { pgPool } from "../dbManager";

export const tickersRouter = Router();

tickersRouter.get("/", async (req, res) => {
    try {
        const tickers = await pgPool.query("SELECT * FROM tickers");
        res.json(tickers.rows);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

tickersRouter.get("/:symbol", async (req, res) => {
    const { symbol } = req.params;
    if (!symbol) {
        res.status(400).json({ error: "Symbol query parameter is required" });
    }
    try {
        const ticker = await pgPool.query("SELECT * FROM tickers WHERE market = $1", [symbol]);
        res.json(ticker.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
