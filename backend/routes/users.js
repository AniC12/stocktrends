const express = require('express');
const User = require('../models/user');
const { createToken, getToken } = require('../helpers/tokens');
const router = new express.Router();

// User registration route
router.post('/users/register', async (req, res, next) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        
        const userId = getToken(req);
        const user = userId ?
            await User.update(userId, req.body) :
            await User.register({ email, password, firstName, lastName });
                
        const token = createToken(user);
        return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
});

// User login route
router.post('/users/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.authenticate(email, password);
        const token = createToken(user); // Create a JWT for the user
        return res.json({ token });
    } catch (err) {
        return next(err);
    }
});

// create guest user
router.post('/users/createguest', async (req, res, next) => {
    try {
        const user = await User.createGuest();
        const token = createToken(user); // Create a JWT for the user
        return res.json({ token });
    } catch (err) {
        return next(err);
    }
});

// Get user profile route
router.get('/users', async (req, res, next) => {
    try {
        const userid = getToken(req);
        const user = await User.get(userid);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

// Update user profile route
router.patch('/users', async (req, res, next) => {
    try {
        const userid = getToken(req);
        const user = await User.update(userid, req.body);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
