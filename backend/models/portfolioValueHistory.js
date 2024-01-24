"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for portfolio value history. */

class PortfolioValueHistory {
    /** Add a new value history entry (from data), update db, return new entry data.
     *
     * data should be { portfolioId, date, value }
     *
     * Returns { id, portfolioId, date, value }
     **/

    static async add({ portfolioId, date, value }) {
        const result = await db.query(
            `INSERT INTO portfolioValueHistory
             (portfolio_id, date, value)
             VALUES ($1, $2, $3)
             RETURNING id, portfolio_id AS "portfolioId", date, value`,
            [portfolioId, date, value]
        );

        const portfolioValueHistory = result.rows[0];

        return portfolioValueHistory;
    }

    /** Find all value history entries for a portfolio.
     *
     * Returns [{ id, portfolioId, date, value }, ...]
     **/

    static async findAllForPortfolio(portfolioId) {
        const result = await db.query(
            `SELECT id, portfolio_id AS "portfolioId", date, value
             FROM portfolioValueHistory
             WHERE portfolio_id = $1`,
            [portfolioId]
        );

        return result.rows;
    }

    /** Given a portfolioValueHistory id, return data about the entry.
     *
     * Returns { id, portfolioId, date, value }
     *
     * Throws NotFoundError if not found.
     **/

    static async get(id) {
        const result = await db.query(
            `SELECT id, portfolio_id AS "portfolioId", date, value
             FROM portfolioValueHistory
             WHERE id = $1`,
            [id]
        );

        const portfolioValueHistory = result.rows[0];

        if (!portfolioValueHistory) throw new NotFoundError(`No portfolio value history entry: ${id}`);

        return portfolioValueHistory;
    }

    /** Update portfolio value history entry with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include: { date, value }
     *
     * Returns { id, portfolioId, date, value }
     *
     * Throws NotFoundError if not found.
     */
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                date: "date",
                value: "value"
            });
        const portfolioValueHistoryIdVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE portfolioValueHistory 
                          SET ${setCols} 
                          WHERE id = ${portfolioValueHistoryIdVarIdx} 
                          RETURNING id, portfolio_id AS "portfolioId", date, value`;
        const result = await db.query(querySql, [...values, id]);
        const portfolioValueHistory = result.rows[0];

        if (!portfolioValueHistory) throw new NotFoundError(`No portfolio value history entry: ${id}`);

        return portfolioValueHistory;
    }

    /** Delete given portfolio value history entry from database; returns undefined.
     *
     * Throws NotFoundError if portfolio value history entry not found.
     **/

    static async remove(id) {
        const result = await db.query(
            `DELETE FROM portfolioValueHistory WHERE id = $1 RETURNING id`,
            [id]
        );

        const portfolioValueHistory = result.rows[0];

        if (!portfolioValueHistory) throw new NotFoundError(`No portfolio value history entry: ${id}`);
    }
}

module.exports = PortfolioValueHistory;
