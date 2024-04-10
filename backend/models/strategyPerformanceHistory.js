"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for strategy performance history. */

class StrategyPerformanceHistory {
    /** Find all performance entries for a strategy.
     *
     * Returns [{ id, strategyId, year, returnRate }, ...]
     **/

    static async findAllForStrategy(strategyId) {
        const result = await db.query(
            `SELECT id, strategy_id AS "strategyId", year, return_rate AS "returnRate"
             FROM strategyPerformanceHistory
             WHERE strategy_id = $1`,
            [strategyId]
        );

        return result.rows;
    }
}

module.exports = StrategyPerformanceHistory;
