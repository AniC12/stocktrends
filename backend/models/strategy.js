"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for strategies. */

class Strategy {
    /** Create a new strategy (from data), update db, return new strategy data.
     *
     * data should be { strategyName, criteria, description, returnRate }
     *
     * Returns { id, strategyName, criteria, description, returnRate }
     *
     * Throws BadRequestError on duplicates.
     **/

    static async create({ strategyName, criteria, description, returnRate }) {
        const duplicateCheck = await db.query(
            `SELECT strategy_name
             FROM strategies
             WHERE strategy_name = $1`,
            [strategyName]
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate strategy: ${strategyName}`);
        }

        const result = await db.query(
            `INSERT INTO strategies
             (strategy_name, criteria, description, return_rate)
             VALUES ($1, $2, $3, $4)
             RETURNING id, strategy_name AS "strategyName", criteria, description, return_rate AS "returnRate"`,
            [strategyName, criteria, description, returnRate]
        );

        const strategy = result.rows[0];

        return strategy;
    }

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

    /** Update strategy data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include: { strategyName, criteria, description, returnRate }
     *
     * Returns { id, strategyName, criteria, description, returnRate }
     *
     * Throws NotFoundError if not found.
     */

    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                strategyName: "strategy_name",
                criteria: "criteria",
                description: "description",
                returnRate: "return_rate"
            });
        const strategyIdVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE strategies 
                          SET ${setCols} 
                          WHERE id = ${strategyIdVarIdx} 
                          RETURNING id, 
                          strategy_name AS "strategyName", 
                          criteria, 
                          description, 
                          return_rate AS "returnRate"`;
        const result = await db.query(querySql, [...values, id]);
        const strategy = result.rows[0];

        if (!strategy) throw new NotFoundError(`No strategy: ${id}`);

        return strategy;
    }

    /** Delete given strategy from database; returns undefined.
     *
     * Throws NotFoundError if strategy not found.
     **/

    static async remove(id) {
        const result = await db.query(
            `DELETE FROM strategies 
            WHERE id = $1 
            RETURNING id`,
            [id]
        );

        const strategy = result.rows[0];

        if (!strategy) throw new NotFoundError(`No strategy: ${id}`);
    }
}

module.exports = Strategy;
