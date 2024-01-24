"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for return rates. */

class ReturnRate {
    /** Add a new return rate entry (from data), update db, return new return rate data.
     *
     * data should be { strategyId, dateInterval, rate }
     *
     * Returns { id, strategyId, dateInterval, rate }
     **/

    static async add({ strategyId, dateInterval, rate }) {
        const result = await db.query(
            `INSERT INTO returnRates
             (strategy_id, date_interval, rate)
             VALUES ($1, $2, $3)
             RETURNING id, strategy_id AS "strategyId", date_interval AS "dateInterval", rate`,
            [strategyId, dateInterval, rate]
        );

        const returnRate = result.rows[0];

        return returnRate;
    }

    /** Find all return rate entries for a strategy.
     *
     * Returns [{ id, strategyId, dateInterval, rate }, ...]
     **/

    static async findAllForStrategy(strategyId) {
        const result = await db.query(
            `SELECT id, strategy_id AS "strategyId", date_interval AS "dateInterval", rate
             FROM returnRates
             WHERE strategy_id = $1`,
            [strategyId]
        );

        return result.rows;
    }

    /** Given a returnRates id, return data about the return rate entry.
     *
     * Returns { id, strategyId, dateInterval, rate }
     *
     * Throws NotFoundError if not found.
     **/

    static async get(id) {
        const result = await db.query(
            `SELECT id, strategy_id AS "strategyId", date_interval AS "dateInterval", rate
             FROM returnRates
             WHERE id = $1`,
            [id]
        );

        const returnRate = result.rows[0];

        if (!returnRate) throw new NotFoundError(`No return rate entry: ${id}`);

        return returnRate;
    }

    /** Update return rate entry data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include: { dateInterval, rate }
     *
     * Returns { id, strategyId, dateInterval, rate }
     *
     * Throws NotFoundError if not found.
     */
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                dateInterval: "date_interval",
                rate: "rate"
            });
        const returnRateIdVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE returnRates 
                          SET ${setCols} 
                          WHERE id = ${returnRateIdVarIdx} 
                          RETURNING id, strategy_id AS "strategyId", date_interval AS "dateInterval", rate`;
        const result = await db.query(querySql, [...values, id]);
        const returnRate = result.rows[0];

        if (!returnRate) throw new NotFoundError(`No return rate entry: ${id}`);

        return returnRate;
    }

    /** Delete given return rate entry from database; returns undefined.
     *
     * Throws NotFoundError if return rate entry not found.
     **/

    static async remove(id) {
        const result = await db.query(
            `DELETE FROM returnRates WHERE id = $1 RETURNING id`,
            [id]
        );

        const returnRate = result.rows[0];

        if (!returnRate) throw new NotFoundError(`No return rate entry: ${id}`);
    }

}

module.exports = ReturnRate;
