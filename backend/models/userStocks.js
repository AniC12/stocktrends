"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for user stocks. */

class UserStock {

    static async insert(symbol, portfolioId, amount) {
        const result = await db.query(
            `INSERT INTO userStocks
             (symbol, portfolio_id, amount)
             VALUES ($1, $2, $3)
             RETURNING id, symbol, portfolio_id AS "portfolioId", amount, 
             purchase_price AS "purchasePrice", purchase_date AS "purchaseDate", 
             sold_date AS "soldDate", sold_price AS "soldPrice"`,
            [symbol.toUpperCase(), portfolioId, amount]
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
            s.symbol AS "symbol", s.price, s.update_date AS "priceUpdateDate"
             FROM userStocks u
             JOIN stocks s ON u.symbol = s.symbol
             WHERE portfolio_id = $1`,
            [portfolioId]
        );

        return result.rows;
    }

    static async updateAmount(symbol, amount) {
        const querySql = `UPDATE userStocks 
                          SET amount = $1
                          WHERE symbol = $2
                          RETURNING id, symbol, portfolio_id AS "portfolioId", 
                                    amount, purchase_price AS "purchasePrice", 
                                    purchase_date AS "purchaseDate", sold_date AS "soldDate", 
                                    sold_price AS "soldPrice"`;
        const result = await db.query(querySql, [amount, symbol.toUpperCase()]);
        const userStock = result.rows[0];

        if (!userStock) throw new NotFoundError(`No user stock entry: ${id}`);

        return userStock;
    }

    /** Delete given user stock entry from database; returns undefined.
     *
     * Throws NotFoundError if user stock entry not found.
     **/

    static async delete(symbol) {
        await db.query(
            `DELETE FROM userStocks WHERE symbol = $1 RETURNING id`,
            [symbol.toUpperCase()]
        );
    }
}

module.exports = UserStock;
