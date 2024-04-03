const express = require('express');
const Portfolio = require('../models/portfolio');
const { authenticateJWT, ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth');
const { getToken } = require('../helpers/tokens');
const UserStock = require('../models/userStocks');
const Utils = require('../helpers/utils');
const TransactionHistory = require('../models/transactionHistory');
const PortfolioValueHistory = require('../models/portfolioValueHistory');
const SuggestedPortfolio = require('../models/suggestedPortfolio');
const router = new express.Router();

// Create a new portfolio
router.post('/', authenticateJWT, ensureLoggedIn, async (req, res, next) => {
    try {
        const { portfolioName, availableCash, strategyId } = req.body;
        availableCash = 1000;
        const userId = getToken(req);
        const now = new Date();
        const creationDate = now.toISOString().split('T')[0];
        const portfolio = await Portfolio.create({ userId, portfolioName, creationDate, availableCash, strategyId });
        return res.status(201).json({ portfolio });
    } catch (err) {
        return next(err);
    }
});

// Get all portfolios for a user
router.get('/', authenticateJWT, ensureLoggedIn, async (req, res, next) => {
    try {
        const userId = getToken(req);
        const portfolios = await Portfolio.findAllForUser(userId);
        return res.json({ portfolios });
    } catch (err) {
        return next(err);
    }
});

// Get a specific portfolio by ID
router.get('/:id', authenticateJWT, ensureLoggedIn, async (req, res, next) => {
    try {
        const id = req.params.id;
        const portfolio = await Portfolio.get(id);
        return res.json({ portfolio });
    } catch (err) {
        return next(err);
    }
});

// Get a specific portfolio by ID
router.get('full/:id', authenticateJWT, ensureLoggedIn, async (req, res, next) => {
    try {
        const id = req.params.id;
        const portfolio = await Portfolio.get(id);
        const userStocks = await UserStock.findAllForPortfolio(id);
        const retVal = {portfolio: portfolio, stocks: userStocks};
        return res.json({ retVal });
    } catch (err) {
        return next(err);
    }
});

// Get a specific portfolio by ID with stocks and prices
router.get('fullWithValues/:id', authenticateJWT, ensureLoggedIn, async (req, res, next) => {
    try {
        const id = req.params.id;
        const portfolio = await Portfolio.get(id);
        const userStocks = await UserStock.findAllForPortfolio(id);

        const enrichedStocks = await Utils.enrichStocks(userStocks);

        let totalValue = portfolio.availableCash;

        enrichedStocks.map(stock => {totalValue = totalValue + stock.value});
            
        const retVal = {portfolio: portfolio, enrichedStocks: enrichedStocks, totalValue: totalValue};
        return res.json({ retVal });
    } catch (err) {
        return next(err);
    }
});

// Get or create a portfolio for a user with a specific strategy
router.get('/strategy/:strategyId', authenticateJWT, ensureLoggedIn, async (req, res, next) => {
    try {
        const { strategyId } = req.params;
        const userId = getToken(req);
        console.log("userid " + userId);
        let portfolio = await Portfolio.findByUserAndStrategy(userId, strategyId);

        //if (!portfolio) {
        //    // Assuming you have a method to create a portfolio with default values
        //    portfolio = await Portfolio.create({ userId, strategyId, /* other necessary default values */ });
        //}

        return res.json({ portfolio });
    } catch (err) {
        return next(err);
    }
});

// Update a specific portfolio
router.post('/save/:id', authenticateJWT, ensureLoggedIn, async (req, res, next) => {
    try {
        const id = req.params.id;
        const { availableCash, stocks } = req.body;

        const portfolio = await Portfolio.updateCash(id, availableCash);
        
        const userStocks = await UserStock.findAllForPortfolio(id);

        const enrichedStocksData = await Utils.enrichStocks(stocks);
        let totalValue = portfolio.availableCash + enrichedStocksData.totalValue;
        enrichedStocksData.enrichedStocks.map(stock => {totalValue = totalValue + stock.value});

        const diff = Utils.calculateStockArraysDiffs(userStocks, stocks);
        const now = Utils.getNow();

        await Promise.all([
            ...diff.remove.map(stock => UserStock.delete(stock.symbol)),
            ...diff.update.map(stock => UserStock.updateAmount(stock.symbol, stock.amount)),
            ...diff.insert.map(stock => UserStock.insert(stock.symbol, id, stock.amount)),
            ...diff.sell.map(stock => TransactionHistory.add(stock.symbol, id, stock.amount, null, now, 'Remove')),
            ...diff.buy.map(stock => TransactionHistory.add(stock.symbol, id, stock.amount, null, now, 'Add')),
            PortfolioValueHistory.add(id, now, totalValue)
        ]);

        const retVal = {portfolio: portfolio, enrichedStocks: enrichedStocks, totalValue: totalValue};

        return res.json({ retVal });
    } catch (err) {
        return next(err);
    }
});

// Apply the strategy to portfolio.
// If confirm is true, then the changes are applied, otherwise we return the list of expected transactions.
router.post('/applystrategy/:id/', authenticateJWT, ensureLoggedIn, async (req, res, next) => {
    try {
        const id = req.params.id;
        const { confirm } = req.body;

        const portfolio = await Portfolio.get(id);
        const userStocks = await UserStock.findAllForPortfolio(id);
        const enrichedUserStocksData = await Utils.enrichStocks(userStocks);        
        const enrichedUserStocks = enrichedUserStocksData.enrichedStocks;
        const totalValue = portfolio.availableCash + enrichedUserStocksData.totalValue;

        const suggestedStocks = await Utils.calculateSuggestedPortfolio(portfolio.strategyId, totalValue);

        const diff = Utils.calculateStockArraysDiffs(enrichedUserStocks, suggestedStocks);

        if (!confirm) {
            const retVal = {sell: diff.sell, buy: diff.buy};
            return res.json({ retVal });
        }

        const now = Utils.getNow();

        await Promise.all([
            ...diff.remove.map(stock => UserStock.delete(stock.symbol)),
            ...diff.update.map(stock => UserStock.updateAmount(stock.symbol, stock.amount)),
            ...diff.insert.map(stock => UserStock.insert(stock.symbol, id, stock.amount)),
            ...diff.sell.map(stock => TransactionHistory.add(stock.symbol, id, stock.amount, stock.price, now, 'Sell')),
            ...diff.buy.map(stock => TransactionHistory.add(stock.symbol, id, stock.amount, stock.price, now, 'Buy')),
            PortfolioValueHistory.add(id, now, totalValue)
        ]);

        const retVal = {portfolio: portfolio, enrichedStocks: suggestedStocks, totalValue: totalValue};

        return res.json({ retVal });
    } catch (err) {
        return next(err);
    }
});

// Delete a specific portfolio
router.delete('/:id', authenticateJWT, ensureLoggedIn, async (req, res, next) => {
    try {
        const id = req.params.id;
        await Portfolio.remove(id);
        return res.json({ message: "Portfolio deleted." });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
