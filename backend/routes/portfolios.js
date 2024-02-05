const express = require('express');
const Portfolio = require('../models/portfolio');
const { authenticateJWT, ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth');
const { getToken } = require('../helpers/tokens');
const router = new express.Router();

// Create a new portfolio
router.post('/', authenticateJWT, ensureLoggedIn, async (req, res, next) => {
    try {
        const { portfolioName, availableCash, strategyId } = req.body;
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
router.patch('/:id', authenticateJWT, ensureLoggedIn, async (req, res, next) => {
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
