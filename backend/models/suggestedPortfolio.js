"use strict";

const db = require("../db");

class SuggestedPortfolio {

    static async findAllForStrategy(strategyId) {
        const result = await db.query(
            `SELECT id, strategy_id AS "strategyId", symbol, amount
             FROM suggestedPortfolio
             WHERE strategy_id = $1`,
            [strategyId]
        );

        return result.rows;
    }
   
}

module.exports = SuggestedPortfolio;
