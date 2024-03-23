"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for strategy performance history. */

class StrategyPerformanceHistory {
    /** Add a new performance history entry (from data), update db, return new entry data.
     *
     * data should be { strategyId, dt, returnRate }
     *
     * Returns { id, strategyId, dt, returnRate }
     **/

    static async add({ strategyId, date, returnRate }) {
        const result = await db.query(
            `INSERT INTO strategyPerformanceHistory
             (strategy_id, date, return_rate)
             VALUES ($1, $2, $3)
             RETURNING id, strategy_id AS "strategyId", date, return_rate AS "returnRate"`,
            [strategyId, date, returnRate]
        );

        const strategyPerformance = result.rows[0];

        return strategyPerformance;
    }

    /** Find all performance entries for a strategy.
     *
     * Returns [{ id, strategyId, date, returnRate }, ...]
     **/

    static async findAllForStrategy(strategyId) {
        const result = await db.query(
            `SELECT id, strategy_id AS "strategyId", date, return_rate AS "returnRate"
             FROM strategyPerformanceHistory
             WHERE strategy_id = $1`,
            [strategyId]
        );

        return result.rows;
    }

    /** Given a strategyPerformanceHistory id, return data about the entry.
     *
     * Returns { id, strategyId, date, returnRate }
     *
     * Throws NotFoundError if not found.
     **/

    static async get(id) {
        const result = await db.query(
            `SELECT id, strategy_id AS "strategyId", date, return_rate AS "returnRate"
             FROM strategyPerformanceHistory
             WHERE id = $1`,
            [id]
        );

        const strategyPerformance = result.rows[0];

        if (!strategyPerformance) throw new NotFoundError(`No strategy performance entry: ${id}`);

        return strategyPerformance;
    }

     /** Delete given strategy performance history entry from database; returns undefined.
     *
     * Throws NotFoundError if strategy performance history entry not found.
     **/

    static async remove(id) {
        const result = await db.query(
            `DELETE FROM strategyPerformanceHistory WHERE id = $1 RETURNING id`,
            [id]
        );

        const strategyPerformanceHistory = result.rows[0];

        if (!strategyPerformanceHistory) throw new NotFoundError(`No strategy performance history entry: ${id}`);
    }
}

module.exports = StrategyPerformanceHistory;
