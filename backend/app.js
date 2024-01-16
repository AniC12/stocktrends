"use strict";

/** Express app for stocktrends. */

const express = require("express");

const { NotFoundError } = require("./expressError");

const app = express();

app.get('/', (req, res) => {
    res.send('Hello, StockTrends backend!');
});

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app;
