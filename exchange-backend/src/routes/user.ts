import { Router } from "express";
import { RedisManager } from "../RedisManager";

export const userRouter = Router();

userRouter.get("/balance", async (req, res) => {
    try {
        const balance = await RedisManager.getInstance().sendAndAwait({
            type: "GET_BALANCE",
            data: {
                userId: req.query.userId as string,
            }
        });
        res.json(balance.payload);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})