"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for stocks. */

class Stock {
    /** Add a new stock (from data), update db, return new stock data.
     *
     * data should be { symbol, price, updateDate }
     *
     * Returns { id, symbol }
     **/

    static async add(symbol, price, updateDate) {
        const result = await db.query(
            `INSERT INTO stocks
             (symbol, price, update_date)
             VALUES ($1, $2, $3)
             RETURNING id, symbol, price, update_date as "updateDate"`,
            [symbol.toUpperCase(), price, updateDate]
        );

        const stock = result.rows[0];
        return stock;
    }

    /** Find all stocks.
     *
     * Returns [{ id, symbol }, ...]
     **/

    static async findAll() {
        const result = await db.query(
            `SELECT id, symbol, price, update_date as "updateDate"
             FROM stocks
             ORDER BY symbol`
        );

        return result.rows;
    }

    /** Given a stock id, return data about stock.
     *
     * Returns { id, symbol, price, updateDate }
     *
     * Throws NotFoundError if not found.
     **/

    static async get(id) {
        const result = await db.query(
            `SELECT id, symbol, price, update_date as "updateDate"
             FROM stocks
             WHERE id = $1`,
            [id]
        );

        const stock = result.rows[0];

        if (!stock) throw new NotFoundError(`No stock: ${id}`);

        return stock;
    }

    /** Given a stock symbol, return data about stock.
     *
     * Returns { id, symbol, price, updateDate }
     *
    **/

    static async getBySymbol(symbol) {
        const result = await db.query(
            `SELECT id, symbol, price, update_date as "updateDate"
             FROM stocks
             WHERE symbol = $1`,
            [symbol.toUpperCase()]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0];
    }

    

    static async updatePrice(id, price, updateDate) {
        const result = await db.query(
            `UPDATE stocks
             SET price = $1, update_date = $2
             WHERE id = $3
             RETURNING id, symbol, price, update_date as "updateDate"`,
            [price, updateDate, id]
        );

        const stock = result.rows[0];

        return stock;
    }

    /** Delete given stock from database; returns undefined.
     *
     * Throws NotFoundError if stock not found.
     **/

    static async remove(id) {
        const result = await db.query(
            `DELETE FROM stocks WHERE id = $1 RETURNING id`,
            [id]
        );

        const stock = result.rows[0];

        if (!stock) throw new NotFoundError(`No stock: ${id}`);
    }
}

module.exports = Stock;
