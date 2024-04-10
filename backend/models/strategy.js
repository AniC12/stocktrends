"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for strategies. */

class Strategy {

    /** Find all strategies.
     *
     * Returns [{ id, strategyName, criteria, description, returnRate }, ...]
     **/

    static async findAll() {
        const result = await db.query(
            `SELECT id, 
                strategy_name AS "strategyName", 
                criteria, 
                description, 
                return_rate AS "returnRate"
                FROM strategies
                ORDER BY strategy_name`
        );

        return result.rows;
    }

    /** Find all unused strategies.
     *
     * Returns [{ id, strategyName, criteria, description, returnRate }, ...]
     **/

    static async findUnused(userId) {
        const result = await db.query(
            `SELECT s.id, 
                s.strategy_name AS "strategyName", 
                s.criteria, 
                s.description, 
                s.return_rate AS "returnRate"
                FROM strategies s
                LEFT JOIN portfolios p 
                    ON s.id = p.strategy_id AND p.user_id = $1
                WHERE p.id IS NULL
                ORDER BY strategy_name`,
                [userId]
        );

        return result.rows;
    }

    /** Given a strategy id, return data about strategy.
     *
     * Returns { id, strategyName, criteria, description, returnRate }
     *
     * Throws NotFoundError if not found.
     **/

    static async get(id) {
        const result = await db.query(
            `SELECT id, 
                strategy_name AS "strategyName", 
                criteria, description, 
                return_rate AS "returnRate"
                FROM strategies
                WHERE id = $1`,
            [id]
        );

        const strategy = result.rows[0];

        if (!strategy) throw new NotFoundError(`No strategy: ${id}`);

        return strategy;
    }
}

module.exports = Strategy;
