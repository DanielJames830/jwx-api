// This file contains all endpoints regarding Acuity Scheduling webhooks
// Author: Daniel Manley

// Load environment variables from a .env file into process.env
require("dotenv").config({ path: ".env" });

// Requirements
const express = require("express");
const router = express.Router();
const axios = require("axios");
const { app } = require("firebase-admin");

// This endpoint handles webhooks sent by Acuity Scheduling
router.post("/webhooks/acuity", async (req, res) => {
	const appointmentId = req.body.id; // Extract the appointment ID from the request body

	// Send the data to another API
	try {
		let data;
		// Fetch appointment details from Acuity Scheduling API using the provided appointment ID
		const response = await axios.get(
			"https://acuityscheduling.com/api/v1/appointments/" + appointmentId,
			{
				auth: {
					username: process.env.ACUITY_USER_ID, // Username for Acuity API authentication
					password: process.env.ACUITY_API_KEY, // API key for Acuity API authentication
				},
			}
		);

		// Check if the appointment type is "[API TEST]"
		if (response.data.type === "[API TEST]") {
			// Extract relevant data from the appointment details using regex patterns
			const kidMakerNameMatch = response.data.formsText.match(
				/Kid-Maker First and Last Name:\s*([^\n]+)/
			);
			const dobMatch = response.data.formsText.match(
				/Date of Birth:\s*([^\n]+)/
			);
			const dobYear = dobMatch ? dobMatch[1].split("/")[2] : null;

			// Prepare the data to be sent to another API
			data = {
				first: response.data.firstName, // First name of the individual
				last: response.data.lastName,   // Last name of the individual
				email: response.data.email,     // Email address
				phone: response.data.phone,     // Phone number
				kidMakerName: kidMakerNameMatch ? kidMakerNameMatch[1] : null, // Kid-Maker's name, if available
				born: Number(dobYear),          // Year of birth, if available
				sendEmail: true,                // Flag to indicate whether to send an email
			};

			console.log(JSON.stringify(data, null, 2)); // Log the data for debugging purposes

			// Send the extracted data to the specified API endpoint
			await axios.post("https://jwxdata.uc.r.appspot.com/member/", data);
			res.status(200).send("Webhook processed successfully"); // Respond with success status
		} else {
			// If the appointment type is not "[API TEST]", log a message and respond with an error
			console.log("The type is not '[API TEST]'.");
			res.status(400).send("The type is not '[API TEST]'. The type was ");
		}
	} catch (error) {
		// Handle any errors that occur during the process
		console.error("Error processing webhook:", error);
		res.status(500).send("Error processing webhook: " + error); // Respond with an error status
	}
});

module.exports = router;
