// This file contains all endpoints regarding Accounts
// Author: Daniel Manley

// Requirements
const express = require("express");
const { verifyAccountData }= require('../middleware/verifyAccountData');
const router = express.Router();
const { Query } = require("firefose");
const Account = require('../models/account')


// This endpoint is for creating accounts
router.post("/account", async (req, res) => {
	try {
        await verifyAccountData(req.body);

		const data = await Account.create(req.body.email);
		res.status(201).send(data);
	} catch (e) {
        // Return a 400 (Bad Request) for any failure.
		res.status(400).send({ error: e.message });        
	}
});

// This endpoint is for finding the account that contains a specific member
router.put("/account", async (req, res) => {
    try {
        const data = await Account.findOne(new Query().where('members', 'array-contains', req.query.id));
        res.status(200).send(data);
    } catch (e) {
        // Return a 400 (Bad Request) for any failure.
        res.status(400).send({ error: e.message });
    }
});

router.put("/account/update", async (req, res) => {
    try {
        const data = await Account.updateById(req.query.id, req.body);
        res.status(200).send(data);
    } catch(e) {
        res.status(400).send({error: e.message});
    }
});

// This endpoint is for to find the account with a specific id
router.get("/account", async (req, res) => {
	try {
		const data = await Member.findById(req.query.id);
		res.status(200).send(data);
	} catch (e) {
        // Return a 400 (Bad Request) for any failure.
		res.status(400).send({ error: e.message });
	}
});


module.exports = router;
