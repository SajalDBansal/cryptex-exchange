import { pgPool } from "./dbManager";

const pgClient = pgPool;

async function initializeDB() {
    await pgClient.query(`
        DROP TABLE IF EXISTS "prices";
        CREATE TABLE "prices"(
            time            TIMESTAMP WITH TIME ZONE NOT NULL,
            symbol          VARCHAR (15) NOT NULL,
            price           DOUBLE PRECISION,
            volume          DOUBLE PRECISION,
            currency_code   VARCHAR (10),
            PRIMARY KEY (time, symbol)
        );
        
        SELECT create_hypertable('prices', 'time', 'symbol', 2, if_not_exists => true);
    `);

    await pgClient.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1m AS
        SELECT
            time_bucket('1 minute', time) AS bucket,
            symbol,
            currency_code,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(volume) AS volume,
        FROM prices
        GROUP BY bucket, symbol, currency_code;

        SELECT add_continuous_aggregate_policy('klines_1m',
        start_offset => INTERVAL '1 hours',
        end_offset => INTERVAL '1 minutes',
        schedule_interval => INTERVAL '5 minutes'
        );
    `);

    await pgClient.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_15m AS
        SELECT
            time_bucket('15 minutes', time) AS bucket,
            symbol,
            currency_code,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(volume) AS volume
        FROM prices
        GROUP BY bucket, symbol, currency_code;

        SELECT add_continuous_aggregate_policy('klines_15m',
        start_offset => INTERVAL '2 hours',
        end_offset => INTERVAL '15 minutes',
        schedule_interval => INTERVAL '5 minutes'
        );
    `);

    await pgClient.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1h AS
        SELECT
            time_bucket('1 hour', time) AS bucket,
            symbol,
            currency_code,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(volume) AS volume
        FROM prices
        GROUP BY bucket, symbol, currency_code;

        SELECT add_continuous_aggregate_policy('klines_1h',
        start_offset => INTERVAL '1 day',
        end_offset => INTERVAL '15 minutes',
        schedule_interval => INTERVAL '5 minutes'
        );
    `);

    await pgClient.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1w AS
        SELECT
            time_bucket('1 week', time) AS bucket,
            symbol,
            currency_code,
            first(price, time) AS open,
            max(price) AS high,
            min(price) AS low,
            last(price, time) AS close,
            sum(volume) AS volume
        FROM prices
        GROUP BY bucket, symbol, currency_code;

        SELECT add_continuous_aggregate_policy('klines_1w',
        start_offset => INTERVAL '60 days',
        end_offset   => INTERVAL '1 day',    
        schedule_interval => INTERVAL '1 day'
        );
    `);

    await pgClient.query(`
        DROP TABLE IF EXISTS "tickers";
        CREATE TABLE "tickers" (
            symbol                TEXT PRIMARY KEY,
            firstPrice            TEXT,
            high                  TEXT,
            lastPrice             TEXT,
            low                   TEXT,
            priceChange           TEXT,
            priceChangePercent    TEXT,
            quoteVolume           TEXT,
            volume                TEXT,
            trades                TEXT,
        );
    `);

    await pgClient.query(`
        DROP TABLE IF EXISTS "trades";
        CREATE TABLE "trades"(
            symbol          TEXT,
            id              BIGINT,
            isBuyerMaker    BOOLEAN,
            price           TEXT,
            quantity        TEXT,
            quoteQuantity   TEXT,
            timestamp       BIGINT,
            PRIMARY KEY (symbol, id)
        );
    `);

    await pgClient.query(`
        DROP TABLE IF EXISTS "orders";
        CREATE TABLE "orders" (
            orderId         TEXT PRIMARY KEY,
            executedQty     NUMERIC NOT NULL,
            market          TEXT,
            price           TEXT,
            quantity        TEXT,
            side            TEXT CHECK (side IN ('buy', 'sell'))
        );
    `);

    console.log("Database initialized");
}

initializeDB().catch(console.error);