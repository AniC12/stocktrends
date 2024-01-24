"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for strategy performance history. */

class StrategyPerformanceHistory {
    /** Add a new performance history entry (from data), update db, return new entry data.
     *
     * data should be { strategyId, date, amount }
     *
     * Returns { id, strategyId, date, amount }
     **/

    static async add({ strategyId, date, amount }) {
        const result = await db.query(
            `INSERT INTO strategyPerformanceHistory
             (strategy_id, date, amount)
             VALUES ($1, $2, $3)
             RETURNING id, strategy_id AS "strategyId", date, amount`,
            [strategyId, date, amount]
        );

        const strategyPerformance = result.rows[0];

        return strategyPerformance;
    }

    /** Find all performance entries for a strategy.
     *
     * Returns [{ id, strategyId, date, amount }, ...]
     **/

    static async findAllForStrategy(strategyId) {
        const result = await db.query(
            `SELECT id, strategy_id AS "strategyId", date, amount
             FROM strategyPerformanceHistory
             WHERE strategy_id = $1`,
            [strategyId]
        );

        return result.rows;
    }

    /** Given a strategyPerformanceHistory id, return data about the entry.
     *
     * Returns { id, strategyId, date, amount }
     *
     * Throws NotFoundError if not found.
     **/

    static async get(id) {
        const result = await db.query(
            `SELECT id, strategy_id AS "strategyId", date, amount
             FROM strategyPerformanceHistory
             WHERE id = $1`,
            [id]
        );

        const strategyPerformance = result.rows[0];

        if (!strategyPerformance) throw new NotFoundError(`No strategy performance entry: ${id}`);

        return strategyPerformance;
    }

    /** Update strategy performance history entry with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include: { date, amount }
     *
     * Returns { id, strategyId, date, amount }
     *
     * Throws NotFoundError if not found.
     */
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                date: "date",
                amount: "amount"
            });
        const strategyPerformanceHistoryIdVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE strategyPerformanceHistory 
                          SET ${setCols} 
                          WHERE id = ${strategyPerformanceHistoryIdVarIdx} 
                          RETURNING id, strategy_id AS "strategyId", date, amount`;
        const result = await db.query(querySql, [...values, id]);
        const strategyPerformanceHistory = result.rows[0];

        if (!strategyPerformanceHistory) throw new NotFoundError(`No strategy performance history entry: ${id}`);

        return strategyPerformanceHistory;
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
