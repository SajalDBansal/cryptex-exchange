import express from "express";
import cors from "cors";
import { orderRouter } from "./routes/order";
import { kLineRouter } from "./routes/kLInes";
import { depthRouter } from "./routes/depth";
import { tradeRouter } from "./routes/trades";
import { tickersRouter } from "./routes/tickers";
import { userRouter } from "./routes/user";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/order", orderRouter);
app.use("/api/v1/depth", depthRouter);
app.use("/api/v1/trades", tradeRouter);
app.use("/api/v1/tickers", tickersRouter);
app.use("/api/v1/klines", kLineRouter);
app.use("/api/v1/user", userRouter);

app.listen(3000, () => {
    console.log(`Exchange API server is running on port 3000`);
})