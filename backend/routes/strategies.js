const express = require('express');
const Strategy = require('../models/strategy');
const router = new express.Router();

// Get all strategies
router.get('/strategies', async (req, res, next) => {
    try {
        const strategies = await Strategy.findAll();
        return res.json({ strategies });
    } catch (err) {
        return next(err);
    }
});

// Get a specific strategy by ID
router.get('/strategies/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const strategy = await Strategy.get(id);
        return res.json({ strategy });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
