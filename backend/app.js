"use strict";

/** Express app for stocktrends. */

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");

const usersRoutes = require("./routes/users");
const portfolioRoutes = require("./routes/portfolios");
const strategyRoutes = require("./routes/strategies");
const stratPerfHistoryRoutes = require("./routes/strategyPerformanceHistory");

const app = express();

app.get('/', (req, res) => {
    res.send('Hello, StockTrends backend!');
});

app.post('/users/blabla', (req, res) => {
    res.send("{'aa':'bb'}")
});

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/users", usersRoutes);
app.use("/portfolios", portfolioRoutes);
app.use("/strategies", strategyRoutes);
app.use("/strategyPerformanceHistory", stratPerfHistoryRoutes);

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
