const express = require('express');
const StrategyPerformanceHistory = require('../models/strategyPerformanceHistory');
const router = new express.Router();

// Get all performance history entries for a specific strategy
router.get('/:strategyId', async (req, res, next) => {
    try {
        const strategyId = req.params.strategyId;
        const performanceHistory = await StrategyPerformanceHistory.findAllForStrategy(strategyId);
        return res.json({ performanceHistory });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
