const express = require("express");
const { verifyAccountData }= require('../middleware/verifyAccountData');
const router = express.Router();
const sgMail = require("@sendgrid/mail");
const { Query } = require("firefose");
const { WebSocket } = require("ws");
const Account = require('../models/account')

router.post("/account", async (req, res) => {
	try {
        await verifyAccountData(req.body);

		const data = await Account.create(req.body.email);
		res.status(201).send(data);
	} catch (e) {
		res.status(400).send({ error: e.message });        
	}
});

router.put("/account", async (req, res) => {
    try {
        const data = await Account.findOne(new Query().where('members', 'array-contains', req.query.id));
        res.status(200).send(data);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
})

router.get("/account", async (req, res) => {
	try {
		const data = await Member.findById(req.query.id);
		res.status(200).send(data);
	} catch (e) {
		res.status(400).send({ error: e.message });
	}
});


module.exports = router;
