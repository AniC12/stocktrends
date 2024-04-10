const express = require('express');
const Strategy = require('../models/strategy');
const { getToken } = require('../helpers/tokens');
const router = new express.Router();

// Get all strategies
router.get('/', async (req, res, next) => {
    try {
        const strategies = await Strategy.findAll();
        return res.json({ strategies });
    } catch (err) {
        return next(err);
    }
});

// Get strategies for which the user does not have a portfolio
router.get('/unused', async (req, res, next) => {
    try {
        const userId = getToken(req);
        const strategies = await Strategy.findUnused(userId);
        return res.json({ strategies });
    } catch (err) {
        console.log('error ', err);
        return next(err);
    }
});

// Get a specific strategy by ID
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const strategy = await Strategy.get(id);
        return res.json({ strategy });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
