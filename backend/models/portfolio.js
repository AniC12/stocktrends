"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for portfolios. */

class Portfolio {
    /** Create a new portfolio (from data), update db, return new portfolio data.
     *
     * data should be { userId, portfolioName, creationDate, availableCash, strategyId }
     *
     * Returns { id, userId, portfolioName, creationDate, availableCash, strategyId }
     *
     * Throws BadRequestError if portfolio already exists.
     **/

    static async create({ userId, portfolioName, creationDate, availableCash, strategyId }) {
        const result = await db.query(
            `INSERT INTO portfolios
                (user_id, portfolio_name, creation_date, available_cash, strategy_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, 
                user_id AS "userId", 
                portfolio_name AS "portfolioName", 
                creation_date AS "creationDate", 
                available_cash AS "availableCash", 
                strategy_id AS "strategyId"`,
            [userId, portfolioName, creationDate, availableCash, strategyId]
        );

        const portfolio = result.rows[0];

        return portfolio;
    }

    /** Find all portfolios for a user.
     *
     * Returns an array of portfolios.
     **/

    static async findAllForUser(userId) {
        const result = await db.query(
            `SELECT id, 
                user_id AS "userId", 
                portfolio_name AS "portfolioName", 
                creation_date AS "creationDate", 
                available_cash AS "availableCash", 
                strategy_id AS "strategyId"
                FROM portfolios
                WHERE user_id = $1`,
            [userId]
        );

        return result.rows;
    }

    /** Find portfolio by user ID and strategy ID.
     *
     * Returns portfolio if found, or null if not found.
     *
     * Throws an error on database query failure.
     */
    static async findByUserAndStrategy(userId, strategyId) {
        const result = await db.query(
            `SELECT id, user_id AS "userId", 
                    portfolio_name AS "portfolioName", 
                    creation_date AS "creationDate", 
                    available_cash AS "availableCash", 
                    strategy_id AS "strategyId"
             FROM portfolios
             WHERE user_id = $1 AND strategy_id = $2`,
            [userId, strategyId]
        );

        const portfolio = result.rows[0];

        return portfolio || null;
    }

    /** Given a portfolio id, return data about portfolio.
     *
     * Returns { id, userId, portfolioName, creationDate, availableCash, strategyId }
     *
     * Throws NotFoundError if not found.
     **/

    static async get(id) {
        const result = await db.query(
            `SELECT id, 
                user_id AS "userId", 
                portfolio_name AS "portfolioName", 
                creation_date AS "creationDate", 
                available_cash AS "availableCash", 
                strategy_id AS "strategyId"
                FROM portfolios
                WHERE id = $1`,
            [id]
        );

        const portfolio = result.rows[0];

        if (!portfolio) throw new NotFoundError(`No portfolio: ${id}`);

        return portfolio;
    }

    /** Update portfolio data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include: { portfolioName, availableCash, strategyId }
     *
     * Returns { id, userId, portfolioName, creationDate, availableCash, strategyId }
     *
     * Throws NotFoundError if not found.
     */

    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                portfolioName: "portfolio_name",
                availableCash: "available_cash",
                strategyId: "strategy_id"
            });
        const portfolioIdVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE portfolios 
                          SET ${setCols} 
                          WHERE id = ${portfolioIdVarIdx} 
                          RETURNING id, 
                          user_id AS "userId", 
                          portfolio_name AS "portfolioName", 
                          creation_date AS "creationDate", 
                          available_cash AS "availableCash", 
                          strategy_id AS "strategyId"`;
        const result = await db.query(querySql, [...values, id]);
        const portfolio = result.rows[0];

        if (!portfolio) throw new NotFoundError(`No portfolio: ${id}`);

        return portfolio;
    }

    /** Delete given portfolio from database; returns undefined.
     *
     * Throws NotFoundError if portfolio not found.
     **/

    static async remove(id) {
        const result = await db.query(
            `DELETE FROM portfolios WHERE id = $1 RETURNING id`,
            [id]
        );

        const portfolio = result.rows[0];

        if (!portfolio) throw new NotFoundError(`No portfolio: ${id}`);
    }

    /** Apply an investment strategy to the portfolio.
     *
     * Accepts a portfolio ID and strategy ID.
     * Associates the specified strategy with the given portfolio.
     *
     * Returns the updated portfolio data.
     *
     * Throws NotFoundError if the portfolio or strategy is not found.
     */

    static async applyToStrategy(portfolioId, strategyId) {
        // Check if the portfolio exists
        const portfolioRes = await db.query(
            `SELECT id FROM portfolios 
                WHERE id = $1`, 
                [portfolioId]
        );
        const portfolio = portfolioRes.rows[0];
        if (!portfolio) throw new NotFoundError(`No portfolio: ${portfolioId}`);

        // Check if the strategy exists
        const strategyRes = await db.query(
            `SELECT id FROM strategies 
                WHERE id = $1`, 
                [strategyId]
        );
        const strategy = strategyRes.rows[0];
        if (!strategy) throw new NotFoundError(`No strategy: ${strategyId}`);

        // Apply the strategy to the portfolio
        const updateRes = await db.query(
            `UPDATE portfolios 
                SET strategy_id = $1 
                WHERE id = $2 
                RETURNING id, strategy_id`,
                [strategyId, portfolioId]
        );
        const updatedPortfolio = updateRes.rows[0];

        return updatedPortfolio;
    }
}

module.exports = Portfolio;
