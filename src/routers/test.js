const express = require('express');
const { getFirestore } = require("firebase-admin/firestore");
const router = express.Router();
const Test = require('../models/test');

router.post('/test', async (req, res) => {
    console.log(req.body);

    try {
        const data = await Test.create(req.body);
        res.status(201).send(data);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

module.exports = router;
