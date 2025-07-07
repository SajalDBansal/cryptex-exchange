import { Router } from "express";
import { pgPool } from "../dbManager";

export const tradeRouter = Router();

tradeRouter.get("/", async (req, res) => {
    const { symbol } = req.query;
    if (!symbol) {
        res.status(400).json({ error: "Symbol query parameter is required" });
    }
    const trades = await pgPool.query("SELECT * FROM trades WHERE market = $1", [symbol]);
    res.json(trades.rows.map(x => ({
        id: x.id,
        isBuyerMaker: x.is_buyer_maker,
        price: x.price,
        quantity: x.quantity,
        quoteQuantity: x.quote_quantity,
        timestamp: x.timestamp_ms,
    })));
});
