"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for transaction history. */

class TransactionHistory {
    /** Add a new transaction entry (from data), update db, return new transaction data.
     *
     * data should be { symbol, portfolioId, quantity, price, date, transactionType }
     *
     * Returns { id, symbol, portfolioId, quantity, price, date, transactionType }
     **/

    static async add(symbol, portfolioId, quantity, price, date, transactionType) {
        const result = await db.query(
            `INSERT INTO transactionHistory
             (symbol, portfolio_id, quantity, price, date, transaction_type)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, symbol, portfolio_id AS "portfolioId", 
                       quantity, price, date, transaction_type AS "transactionType"`,
            [symbol.toUpperCase(), portfolioId, quantity, price, date, transactionType]
        );

        const transaction = result.rows[0];

        return transaction;
    }

    /** Find all transaction entries for a portfolio.
     *
     * Returns [{ id, symbol, portfolioId, quantity, price, date, transactionType }, ...]
     **/

    static async findAllForPortfolio(portfolioId) {
        const result = await db.query(
            `SELECT id, symbol, portfolio_id AS "portfolioId", 
                    quantity, price, date, transaction_type AS "transactionType"
             FROM transactionHistory
             WHERE portfolio_id = $1`,
            [portfolioId]
        );

        return result.rows;
    }

    /** Given a transactionHistory id, return data about the transaction.
     *
     * Returns { id, symbol, portfolioId, quantity, price, date, transactionType }
     *
     * Throws NotFoundError if not found.
     **/

    static async get(id) {
        const result = await db.query(
            `SELECT id, symbol, portfolio_id AS "portfolioId", 
                    quantity, price, date, transaction_type AS "transactionType"
             FROM transactionHistory
             WHERE id = $1`,
            [id]
        );

        const transaction = result.rows[0];

        if (!transaction) throw new NotFoundError(`No transaction history entry: ${id}`);

        return transaction;
    }
}

module.exports = TransactionHistory;
