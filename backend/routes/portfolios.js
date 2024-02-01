const express = require('express');
const Portfolio = require('../models/portfolio');
const { authenticateJWT, ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth');
const { getToken } = require('../helpers/tokens');
const router = new express.Router();

// Create a new portfolio
router.post('/portfolios', authenticateJWT, ensureLoggedIn, async (req, res, next) => {
    try {
        const { userId, portfolioName, creationDate, availableCash, strategyId } = req.body;
        const portfolio = await Portfolio.create({ userId, portfolioName, creationDate, availableCash, strategyId });
        return res.status(201).json({ portfolio });
    } catch (err) {
        return next(err);
    }
});

// Get all portfolios for a user
router.get('/portfolios', authenticateJWT, ensureCorrectUser, async (req, res, next) => {
    try {
        const userId = getToken(req);
        const portfolios = await Portfolio.findAllForUser(userId);
        return res.json({ portfolios });
    } catch (err) {
        return next(err);
    }
});

// Get a specific portfolio by ID
router.get('/portfolios/:id', authenticateJWT, ensureLoggedIn, async (req, res, next) => {
    try {
        const id = req.params.id;
        const portfolio = await Portfolio.get(id);
        return res.json({ portfolio });
    } catch (err) {
        return next(err);
    }
});

// Get or create a portfolio for a user with a specific strategy
router.get('/portfolios/user/:userId/strategy/:strategyId', authenticateJWT, ensureLoggedIn, async (req, res, next) => {
    try {
        const { userId, strategyId } = req.params;
        let portfolio = await Portfolio.findByUserAndStrategy(userId, strategyId);

        if (!portfolio) {
            // Assuming you have a method to create a portfolio with default values
            portfolio = await Portfolio.create({ userId, strategyId, /* other necessary default values */ });
        }

        return res.json({ portfolio });
    } catch (err) {
        return next(err);
    }
});

// Update a specific portfolio
router.patch('/portfolios/:id', authenticateJWT, ensureLoggedIn, async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const portfolio = await Portfolio.update(id, data);
        return res.json({ portfolio });
    } catch (err) {
        return next(err);
    }
});

// Delete a specific portfolio
router.delete('/portfolios/:id', authenticateJWT, ensureLoggedIn, async (req, res, next) => {
    try {
        const id = req.params.id;
        await Portfolio.remove(id);
        return res.json({ message: "Portfolio deleted." });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
