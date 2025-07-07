import { Router } from "express";
import { RedisManager } from "../RedisManager";

export const orderRouter = Router();

orderRouter.post("/", async (req, res) => {
    const { market, price, quantity, side, userId } = req.body;
    const order = await RedisManager.getInstance().sendAndAwait({
        type: "CREATE_ORDER",
        data: { market, price, quantity, side, userId }
    });
    res.json(order.payload);
});

orderRouter.delete("/", async (req, res) => {
    const { orderId, market } = req.body;
    const order = await RedisManager.getInstance().sendAndAwait({
        type: "CANCEL_ORDER",
        data: { orderId, market }
    });
    res.json(order.payload);
});

orderRouter.get("/open", async (req, res) => {
    const orders = await RedisManager.getInstance().sendAndAwait({
        type: "GET_OPEN_ORDERS",
        data: {
            userId: req.query.userId as string,
            market: req.query.market as string,
        }
    });
    res.json(orders.payload);
});