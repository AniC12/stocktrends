"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for user stocks. */

class UserStock {
    /** Add a new stock entry to user's portfolio (from data), update db, return new stock entry data.
     *
     * data should be { stockId, portfolioId, amount, purchasePrice, purchaseDate, soldDate, soldPrice }
     *
     * Returns { id, stockId, portfolioId, amount, purchasePrice, purchaseDate, soldDate, soldPrice }
     **/

    static async add({ stockId, portfolioId, amount, purchasePrice, purchaseDate, soldDate, soldPrice }) {
        const result = await db.query(
            `INSERT INTO userStocks
             (stock_id, portfolio_id, amount, purchase_price, purchase_date, sold_date, sold_price)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, stock_id AS "stockId", portfolio_id AS "portfolioId", amount, 
             purchase_price AS "purchasePrice", purchase_date AS "purchaseDate", 
             sold_date AS "soldDate", sold_price AS "soldPrice"`,
            [stockId, portfolioId, amount, purchasePrice, purchaseDate, soldDate, soldPrice]
        );

        const userStock = result.rows[0];

        return userStock;
    }

    /** Find all stock entries for a user's portfolio.
     *
     * Returns [{ id, stockId, portfolioId, amount, purchasePrice, purchaseDate, soldDate, soldPrice }, ...]
     **/

    static async findAllForPortfolio(portfolioId) {
        const result = await db.query(
            `SELECT id, stock_id AS "stockId", portfolio_id AS "portfolioId", amount, 
             purchase_price AS "purchasePrice", purchase_date AS "purchaseDate", 
             sold_date AS "soldDate", sold_price AS "soldPrice"
             FROM userStocks
             WHERE portfolio_id = $1`,
            [portfolioId]
        );

        return result.rows;
    }

    /** Given a userStock id, return data about the stock entry.
     *
     * Returns { id, stockId, portfolioId, amount, purchasePrice, purchaseDate, soldDate, soldPrice }
     *
     * Throws NotFoundError if not found.
     **/

    static async get(id) {
        const result = await db.query(
            `SELECT id, stock_id AS "stockId", portfolio_id AS "portfolioId", amount, 
             purchase_price AS "purchasePrice", purchase_date AS "purchaseDate", 
             sold_date AS "soldDate", sold_price AS "soldPrice"
             FROM userStocks
             WHERE id = $1`,
            [id]
        );

        const userStock = result.rows[0];

        if (!userStock) throw new NotFoundError(`No user stock entry: ${id}`);

        return userStock;
    }

    /** Update user stock entry data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include: { amount, purchasePrice, purchaseDate, soldDate, soldPrice }
     *
     * Returns { id, stockId, portfolioId, amount, purchasePrice, purchaseDate, soldDate, soldPrice }
     *
     * Throws NotFoundError if not found.
     */
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                amount: "amount",
                purchasePrice: "purchase_price",
                purchaseDate: "purchase_date",
                soldDate: "sold_date",
                soldPrice: "sold_price"
            });
        const userStockIdVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE userStocks 
                          SET ${setCols} 
                          WHERE id = ${userStockIdVarIdx} 
                          RETURNING id, stock_id AS "stockId", portfolio_id AS "portfolioId", 
                                    amount, purchase_price AS "purchasePrice", 
                                    purchase_date AS "purchaseDate", sold_date AS "soldDate", 
                                    sold_price AS "soldPrice"`;
        const result = await db.query(querySql, [...values, id]);
        const userStock = result.rows[0];

        if (!userStock) throw new NotFoundError(`No user stock entry: ${id}`);

        return userStock;
    }

    /** Delete given user stock entry from database; returns undefined.
     *
     * Throws NotFoundError if user stock entry not found.
     **/

    static async remove(id) {
        const result = await db.query(
            `DELETE FROM userStocks WHERE id = $1 RETURNING id`,
            [id]
        );

        const userStock = result.rows[0];

        if (!userStock) throw new NotFoundError(`No user stock entry: ${id}`);
    }
}

module.exports = UserStock;
