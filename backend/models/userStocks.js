"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for user stocks. */

class UserStock {
    /** Add a new stock entry to user's portfolio (from data), update db, return new stock entry data.
     *
     * data should be { symbol, portfolioId, amount, purchasePrice, purchaseDate, soldDate, soldPrice }
     *
     * Returns { id, symbol, portfolioId, amount, purchasePrice, purchaseDate, soldDate, soldPrice }
     **/

    static async add({ symbol, portfolioId, amount, purchasePrice, purchaseDate, soldDate, soldPrice }) {
        const result = await db.query(
            `INSERT INTO userStocks
             (symbol, portfolio_id, amount, purchase_price, purchase_date, sold_date, sold_price)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, symbol, portfolio_id AS "portfolioId", amount, 
             purchase_price AS "purchasePrice", purchase_date AS "purchaseDate", 
             sold_date AS "soldDate", sold_price AS "soldPrice"`,
            [symbol, portfolioId, amount, purchasePrice, purchaseDate, soldDate, soldPrice]
        );

        const userStock = result.rows[0];

        return userStock;
    }

    static async insert({ symbol, portfolioId, amount }) {
        const result = await db.query(
            `INSERT INTO userStocks
             (symbol, portfolio_id, amount)
             VALUES ($1, $2, $3)
             RETURNING id, symbol, portfolio_id AS "portfolioId", amount, 
             purchase_price AS "purchasePrice", purchase_date AS "purchaseDate", 
             sold_date AS "soldDate", sold_price AS "soldPrice"`,
            [symbol, portfolioId, amount]
        );

        const userStock = result.rows[0];

        return userStock;
    }

    /** Find all stock entries for a user's portfolio.
     *
     * Returns [{ id, symbol, portfolioId, amount, purchasePrice, purchaseDate, soldDate, soldPrice }, ...]
     **/

    static async findAllForPortfolio(portfolioId) {
        const result = await db.query(
            `SELECT u.id, u.symbol, u.portfolio_id AS "portfolioId", u.amount, 
            u.purchase_price AS "purchasePrice", u.purchase_date AS "purchaseDate", 
            u.sold_date AS "soldDate", u.sold_price AS "soldPrice",
            s.ticket_symbol AS "symbol", s.price, s.update_date AS "priceUpdateDate"
             FROM userStocks u
             JOIN stocks s ON u.symbol = s.symbol
             WHERE portfolio_id = $1`,
            [portfolioId]
        );

        return result.rows;
    }

    /** Given a userStock id, return data about the stock entry.
     *
     * Returns { id, symbol, portfolioId, amount, purchasePrice, purchaseDate, soldDate, soldPrice }
     *
     * Throws NotFoundError if not found.
     **/

    static async get(id) {
        const result = await db.query(
            `SELECT id, symbol, portfolio_id AS "portfolioId", amount, 
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
     * Returns { id, symbol, portfolioId, amount, purchasePrice, purchaseDate, soldDate, soldPrice }
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
                          RETURNING id, symbol, portfolio_id AS "portfolioId", 
                                    amount, purchase_price AS "purchasePrice", 
                                    purchase_date AS "purchaseDate", sold_date AS "soldDate", 
                                    sold_price AS "soldPrice"`;
        const result = await db.query(querySql, [...values, id]);
        const userStock = result.rows[0];

        if (!userStock) throw new NotFoundError(`No user stock entry: ${id}`);

        return userStock;
    }


    static async updateAmount(symbol, amount) {
        const querySql = `UPDATE userStocks 
                          SET amount = $1
                          WHERE symbol = $2
                          RETURNING id, symbol, portfolio_id AS "portfolioId", 
                                    amount, purchase_price AS "purchasePrice", 
                                    purchase_date AS "purchaseDate", sold_date AS "soldDate", 
                                    sold_price AS "soldPrice"`;
        const result = await db.query(querySql, [amount, symbol]);
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

    /** Delete given user stock entry from database; returns undefined.
     *
     * Throws NotFoundError if user stock entry not found.
     **/

    static async delete(symbol) {
        await db.query(
            `DELETE FROM userStocks WHERE symbol = $1 RETURNING id`,
            [symbol]
        );
    }
}

module.exports = UserStock;
