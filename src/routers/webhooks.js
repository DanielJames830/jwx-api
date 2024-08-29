// This file contains all endpoints regarding Acuity Scheduling webhooks
// Author: Daniel Manley

// Load environment variables from a .env file into process.env
require("dotenv").config({ path: ".env" });

// Requirements
const express = require("express");
const router = express.Router();
const axios = require("axios");
const { app } = require("firebase-admin");
const Account = require("../models/account");
const { Query } = require("firefose");
const sgMail = require("@sendgrid/mail");

// This endpoint handles webhooks sent by Acuity Scheduling
router.post("/webhooks/acuity", async (req, res) => {
	const orderId = req.body.id; // Extract the appointment ID from the request body
	console.log(req.body);
	// Send the data to another API
	try {
		let data;
		// Fetch appointment details from Acuity Scheduling API using the provided appointment ID
		const response = await axios.get(
			"https://acuityscheduling.com/api/v1/orders/" + orderId,
			{
				auth: {
					username: process.env.ACUITY_USER_ID, // Username for Acuity API authentication
					password: process.env.ACUITY_API_KEY, // API key for Acuity API authentication
				},
			}
		);

		data = {
			first: response.data.firstName, // First name of the individual
			last: response.data.lastName, // Last name of the individual
			email: response.data.email, // Email address
			phone: response.data.phone, // Phone number
		};

		let account;

		account = await Account.findOne(
			new Query().where("email", "==", response.data.email)
		);

		if (account == null) {
			const postResponse = await axios.post(
				process.env.BASE_URL + "/account",
				data
			);
			account = postResponse.data;
		}

		await Account.updateById(account.id, { credits: account.credits + 1 });

		sgMail.setApiKey(process.env.SENDGRID_API_KEY);
		const msg = {
			to: response.data.email,
			from: "daniel.manley@juiceworks3d.com",
			subject: "Welcome to the club!",
			templateId: "d-b280ed837f3345d39b9fe3728f594197",
			dynamic_template_data: {
				firstName: response.data.firstName,
			},
		};

		// Send the email
		sgMail
			.send(msg)
			.then(() => {
				console.log("Email sent successfully");
			})
			.catch((error) => {
				console.error("Error sending email:", error);
			});

		res.status(200).send("Webhook processed successfully");
	} catch (error) {
		// Handle any errors that occur during the process
		console.error("Error processing webhook:", error);
		res.status(500).send("Error processing webhook: " + error); // Respond with an error status
	}
});

router.post("/webhooks/");

module.exports = router;
