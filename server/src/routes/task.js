const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const authentication = require('../middleware/authentication');


router.get('/', authentication, async (req, res) => {
    try {
        console.log(req.user._id);
        const tasks = await Task.find({ owner: req.user._id });
        res.send(tasks);
    }
    catch (e) {
        res.status(500).send();
    }
});

router.get('/:id', authentication, async (req, res) => {
    const id = req.params.id;

    try {
        const task = await Task.findOne({ _id: id, owner: req.user._id });
        task ? res.send(task) : res.status(404).send();
    }
    catch (e) {
        res.status(500).send(e);
    }
});

router.post('/', authentication, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    }
    catch (e) {
        res.status(400).send(e);
    }
});
router.patch('/:id', authentication, async (req, res) => {
    const updates = Object.keys(req.body);
    const validUpdates = ['description', 'completed', 'dueDate'];
    const allowedUpdate = updates.every((update) => validUpdates.includes(update));
    if (!allowedUpdate) {
        return res.status(400).send({ error: 'Update on non existent field not allowed' });
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            res.status(400).send();
        }
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/:id', authentication, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        task ? res.send(task) : res.status(400).send();
    }
    catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;

