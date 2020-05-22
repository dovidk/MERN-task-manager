const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Task = require('../models/task');
const authentication = require('../middleware/authentication');

router.get('/me', authentication, async (req, res) => {
    res.send(req.user);
});

router.get('/users', authentication, async (req, res) => {
    if (req.user.isAdmin) {
        const all = await User.find();
        res.send(all)
    }
    else {
        res.status(401).send('Unauthorized');
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCreds(req.body.name, req.body.password);
        const token = await user.generateToken();
        res.cookie('jwt', token, { maxAge: 36000 }).send({ user });
    }
    catch (e) {
        res.status(400).send('ahhh');
    }
});
router.post('/logout', authentication, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    }
    catch (e) {
        res.status(500).send();
    }
});
// this route is not used on the front end but it allows someone to logout of all the places they are logged in from.
// for example if someone logged in from their laptop and phone...
router.post('/logoutAll', authentication, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }
    catch (e) {
        res.status(500).send();
    }
});
router.post('/', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateToken();
        res.cookie('jwt', token, { HttpOnly: false }).send({ user });
    }
    catch (e) {
        res.status(400).send(e);
    }
});

// you can not update yet on the front end but i would like to implement that soon.

router.patch('/me', authentication, async (req, res) => {
    const updates = Object.keys(req.body);
    const validUpdates = ['name', 'email', 'age', 'password'];
    const allowedUpdate = updates.every((update) => validUpdates.includes(update));
    if (!allowedUpdate) {
        return res.status(400).send({ error: 'Update on non existent field not allowed' });
    }
    try {
        const user = req.user;
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();
    }
    catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/me', authentication, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);
        await Task.deleteMany({ owner: user._id });
        user ? res.send(req.user) : res.status(400).send('user not found');
    }
    catch (e) {
        res.status(500).send(e);
    }

});


module.exports = router;