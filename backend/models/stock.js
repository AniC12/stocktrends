"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for stocks. */

class Stock {
    /** Add a new stock (from data), update db, return new stock data.
     *
     * data should be { tickerSymbol, companyName, startDate }
     *
     * Returns { id, tickerSymbol, companyName, startDate }
     **/

    static async add({ tickerSymbol, companyName, startDate }) {
        const result = await db.query(
            `INSERT INTO stocks
             (ticket_symbol, company_name, start_date)
             VALUES ($1, $2, $3)
             RETURNING id, ticket_symbol AS "tickerSymbol", company_name AS "companyName", start_date AS "startDate"`,
            [tickerSymbol, companyName, startDate]
        );

        const stock = result.rows[0];

        return stock;
    }

    /** Find all stocks.
     *
     * Returns [{ id, tickerSymbol, companyName, startDate }, ...]
     **/

    static async findAll() {
        const result = await db.query(
            `SELECT id, ticket_symbol AS "tickerSymbol", company_name AS "companyName", start_date AS "startDate"
             FROM stocks
             ORDER BY company_name`
        );

        return result.rows;
    }

    /** Given a stock id, return data about stock.
     *
     * Returns { id, tickerSymbol, companyName, startDate }
     *
     * Throws NotFoundError if not found.
     **/

    static async get(id) {
        const result = await db.query(
            `SELECT id, ticket_symbol AS "tickerSymbol", company_name AS "companyName", start_date AS "startDate"
             FROM stocks
             WHERE id = $1`,
            [id]
        );

        const stock = result.rows[0];

        if (!stock) throw new NotFoundError(`No stock: ${id}`);

        return stock;
    }

    /** Update stock data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include: { tickerSymbol, companyName, startDate }
     *
     * Returns { id, tickerSymbol, companyName, startDate }
     *
     * Throws NotFoundError if not found.
     */
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                tickerSymbol: "ticket_symbol",
                companyName: "company_name",
                startDate: "start_date"
            });
        const stockIdVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE stocks 
                          SET ${setCols} 
                          WHERE id = ${stockIdVarIdx} 
                          RETURNING id, ticket_symbol AS "tickerSymbol", company_name AS "companyName", start_date AS "startDate"`;
        const result = await db.query(querySql, [...values, id]);
        const stock = result.rows[0];

        if (!stock) throw new NotFoundError(`No stock: ${id}`);

        return stock;
    }

    /** Delete given stock from database; returns undefined.
     *
     * Throws NotFoundError if stock not found.
     **/

    static async remove(id) {
        const result = await db.query(
            `DELETE FROM stocks WHERE id = $1 RETURNING id`,
            [id]
        );

        const stock = result.rows[0];

        if (!stock) throw new NotFoundError(`No stock: ${id}`);
    }
}

module.exports = Stock;
