"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for transaction history. */

class TransactionHistory {
    /** Add a new transaction entry (from data), update db, return new transaction data.
     *
     * data should be { stockId, portfolioId, quantity, price, date, transactionType }
     *
     * Returns { id, stockId, portfolioId, quantity, price, date, transactionType }
     **/

    static async add({ stockId, portfolioId, quantity, price, date, transactionType }) {
        const result = await db.query(
            `INSERT INTO transactionHistory
             (stock_id, portfolio_id, quantity, price, date, transaction_type)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, stock_id AS "stockId", portfolio_id AS "portfolioId", 
                       quantity, price, date, transaction_type AS "transactionType"`,
            [stockId, portfolioId, quantity, price, date, transactionType]
        );

        const transaction = result.rows[0];

        return transaction;
    }

    /** Find all transaction entries for a portfolio.
     *
     * Returns [{ id, stockId, portfolioId, quantity, price, date, transactionType }, ...]
     **/

    static async findAllForPortfolio(portfolioId) {
        const result = await db.query(
            `SELECT id, stock_id AS "stockId", portfolio_id AS "portfolioId", 
                    quantity, price, date, transaction_type AS "transactionType"
             FROM transactionHistory
             WHERE portfolio_id = $1`,
            [portfolioId]
        );

        return result.rows;
    }

    /** Given a transactionHistory id, return data about the transaction.
     *
     * Returns { id, stockId, portfolioId, quantity, price, date, transactionType }
     *
     * Throws NotFoundError if not found.
     **/

    static async get(id) {
        const result = await db.query(
            `SELECT id, stock_id AS "stockId", portfolio_id AS "portfolioId", 
                    quantity, price, date, transaction_type AS "transactionType"
             FROM transactionHistory
             WHERE id = $1`,
            [id]
        );

        const transaction = result.rows[0];

        if (!transaction) throw new NotFoundError(`No transaction history entry: ${id}`);

        return transaction;
    }

    /** Update transaction history entry with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include: { quantity, price, date, transactionType }
     *
     * Returns { id, stockId, portfolioId, quantity, price, date, transactionType }
     *
     * Throws NotFoundError if not found.
     */
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                quantity: "quantity",
                price: "price",
                date: "date",
                transactionType: "transaction_type"
            });
        const transactionHistoryIdVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE transactionHistory 
                          SET ${setCols} 
                          WHERE id = ${transactionHistoryIdVarIdx} 
                          RETURNING id, stock_id AS "stockId", portfolio_id AS "portfolioId", 
                                    quantity, price, date, transaction_type AS "transactionType"`;
        const result = await db.query(querySql, [...values, id]);
        const transaction = result.rows[0];

        if (!transaction) throw new NotFoundError(`No transaction history entry: ${id}`);

        return transaction;
    }

    /** Delete given transaction history entry from database; returns undefined.
     *
     * Throws NotFoundError if transaction history entry not found.
     **/

    static async remove(id) {
        const result = await db.query(
            `DELETE FROM transactionHistory WHERE id = $1 RETURNING id`,
            [id]
        );

        const transaction = result.rows[0];

        if (!transaction) throw new NotFoundError(`No transaction history entry: ${id}`);
    }
}

module.exports = TransactionHistory;
