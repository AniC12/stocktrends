"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for market data. */

class MarketData {
    /** Add new market data entry (from data), update db, return new market data.
     *
     * data should be { symbol, date, openPrice, closePrice, high, low, volume, marketCapitalization }
     *
     * Returns { id, symbol, date, openPrice, closePrice, high, low, volume, marketCapitalization }
     **/

    static async add({ symbol, date, openPrice, closePrice, high, low, volume, marketCapitalization }) {
        const result = await db.query(
            `INSERT INTO marketData
             (symbol, date, open_price, close_price, high, low, volume, market_capitalization)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING id, symbol, date, 
                       open_price AS "openPrice", close_price AS "closePrice", 
                       high, low, volume, market_capitalization AS "marketCapitalization"`,
            [symbol, date, openPrice, closePrice, high, low, volume, marketCapitalization]
        );

        const marketData = result.rows[0];

        return marketData;
    }

    /** Find all market data for a stock.
     *
     * Returns [{ id, symbol, date, openPrice, closePrice, high, low, volume, marketCapitalization }, ...]
     **/

    static async findAllForStock(symbol) {
        const result = await db.query(
            `SELECT id, symbol, date, 
                    open_price AS "openPrice", close_price AS "closePrice", 
                    high, low, volume, market_capitalization AS "marketCapitalization"
             FROM marketData
             WHERE symbol = $1`,
            [symbol]
        );

        return result.rows;
    }

    /** Given a marketData id, return data about the market data entry.
     *
     * Returns { id, symbol, date, openPrice, closePrice, high, low, volume, marketCapitalization }
     *
     * Throws NotFoundError if not found.
     **/

    static async get(id) {
        const result = await db.query(
            `SELECT id, symbol, date, 
                    open_price AS "openPrice", close_price AS "closePrice", 
                    high, low, volume, market_capitalization AS "marketCapitalization"
             FROM marketData
             WHERE id = $1`,
            [id]
        );

        const marketData = result.rows[0];

        if (!marketData) throw new NotFoundError(`No market data entry: ${id}`);

        return marketData;
    }

    /** Update market data entry with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include: { openPrice, closePrice, high, low, volume, marketCapitalization }
     *
     * Returns { id, symbol, date, openPrice, closePrice, high, low, volume, marketCapitalization }
     *
     * Throws NotFoundError if not found.
     */
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                openPrice: "open_price",
                closePrice: "close_price",
                high: "high",
                low: "low",
                volume: "volume",
                marketCapitalization: "market_capitalization"
            });
        const marketDataIdVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE marketData 
                          SET ${setCols} 
                          WHERE id = ${marketDataIdVarIdx} 
                          RETURNING id, symbol, date, 
                                    open_price AS "openPrice", close_price AS "closePrice", 
                                    high, low, volume, market_capitalization AS "marketCapitalization"`;
        const result = await db.query(querySql, [...values, id]);
        const marketData = result.rows[0];

        if (!marketData) throw new NotFoundError(`No market data entry: ${id}`);

        return marketData;
    }

    /** Delete given market data entry from database; returns undefined.
     *
     * Throws NotFoundError if market data entry not found.
     **/

    static async remove(id) {
        const result = await db.query(
            `DELETE FROM marketData WHERE id = $1 RETURNING id`,
            [id]
        );

        const marketData = result.rows[0];

        if (!marketData) throw new NotFoundError(`No market data entry: ${id}`);
    }

}

module.exports = MarketData;
