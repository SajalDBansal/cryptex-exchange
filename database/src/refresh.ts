import { pgPool } from "./dbManager";

const pgClinet = pgPool;

// a function used to refresh the materialized views this recalculates the values for each bucket

async function refreshViews() {
    await pgClinet.query(`REFRESH MATERIALIZED VIEW klines_1m`);
    await pgClinet.query(`REFRESH MATERIALIZED VIEW klines_15m`);
    await pgClinet.query(`REFRESH MATERIALIZED VIEW klines_1h`);
    await pgClinet.query(`REFRESH MATERIALIZED VIEW klines_1w`);

    console.log("Materialized views refreshed");
}

// // Not to be used as we are using auto aggregate policies for the views
// refreshViews().catch(console.error);
// setInterval(refreshViews, 1000 * 60);