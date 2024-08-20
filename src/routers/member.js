// This file contains all endpoints regarding Members
// Author: Daniel Manley

// requirements
const express = require("express");
const router = express.Router();
const Member = require("../models/member");
const sgMail = require("@sendgrid/mail");
const { Query } = require("firefose");
const { getWebSocketInstance } = require("./webSocket");
const { WebSocket } = require("ws");
const Account = require("../models/account");

// The end point creates new members and either associates them with
// an existing account or creates a new account if none exists.
// We also send a welcome email from this endpoint.
router.post("/member", async (req, res) => {
	try {
		// Sanitize the request
		const memberData = {
			first: req.body.first,
			last: req.body.last,
			born: req.body.born,
			isMembershipActive: true,
		};

		// Check if account with the given email exists
		var memberAccount = await Account.find(
			new Query().where("email", "==", req.body.email)
		);
		console.log(memberAccount);
		if (memberAccount.length === 0) {
			console.log("No account found with that email.");
			// If account does not exist, create a new one
			const newAccountData = {
				email: req.body.email,
				phone: req.body.phone,
				first: req.body.first,
				last: req.body.last,
				members: [],
			};
			memberAccount[0] = await Account.create(newAccountData);
			console.log("New account created for email:", req.body.email);
		} else {
			// If account exists, add the new member to its members array
			console.log("Member added to existing account:", memberAccount);
		}

		// Assuming there have not been any errors, you can now create the 
		// new member
		const newMember = await Member.create(memberData);
		console.log("New member created:", newMember);

		memberAccount[0].members.push(newMember.id);

		// update the associated account to include this 
		// new membership
		await Account.updateById(memberAccount[0].id, {
			members: memberAccount[0].members,
		});

		// Only send an email if requested by the client.
		// If you aren't seeing any emails being sent, check your request 
		// for "sendEmail": true 
		if (req.body.sendEmail) {
			sgMail.setApiKey(process.env.SENDGRID_API_KEY);
			const msg = {
				to: req.body.email,
				from: "daniel.manley@juiceworks3d.com",
				subject: "Welcome to the club!",
				templateId: "d-b280ed837f3345d39b9fe3728f594197",
				dynamic_template_data: {
					firstName: req.body.first,
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
		}

		// Return a 201 (Created) status if successful.
		res.status(201).send(newMember);
	} catch (e) {

		// Return a 400 (Bad Request) for any failure.
		console.error("Error in /member endpoint:", e);
		res.status(400).send({ error: e.message });
	}
});

// This endpoint gets the member specified within the 
// request's queries. (example: https://localhost:3000/member?id=12345678)
router.get("/member", async (req, res) => {
	try {
		const data = await Member.findById(req.query.id);
		
		// Return a 400 (Bad Request) if no user exists with
		// the provided id
		if(data == null) {
			res.status(400).send("No such user exists.");
			return;
		}

		// Return a 200 (OK) status if a member was found by that Id.
		res.status(200).send(data);
	} catch (e) {

		// Return a 400 (Bad Request) for any failure.
		res.status(400).send({ error: e.message });
	}
});

// This endpoint returns a list of all existing members.
router.get("/members", async (req, res) => {
	try {
		const data = await Member.find(new Query());
		// return a 200 (OK) with a list of members.
		res.status(200).send(data);
	} catch (e) {
		// Return a 400 (Bad Request) for any failure.
		res.status(400).send({ error: e.message });
	}
});

// This endpoint returns a list of all members who are currently clocked in.
router.post("/members", async (req, res) => {
	// Get all members whose next scan will be a "clock out".
	const query = new Query().where("isClockOut", "==", req.body.isClockOut);
	try {
		const data = await Member.find(query);
		// return a 200 (OK) with a list of members.
		res.status(200).send(data);
	} catch (e) {
		// Return a 400 (Bad Request) for any failure.
		res.status(400).send({ error: e.message });
	}
});

// This endpoint will activate the membership of whichever member id is specified
// in the url.
router.patch("/member/:id/activate", async (req, res) => {
	try {

		// Get the member with the correspoding Id.
		const data = await Member.findById(req.params.id);
		console.log(
			`This member has been allotted ${28800000 / (1000 * 60)} minutes`
		);

		// Assign the member field monthlyTimeRemaining with 8 hours in miliseconds.
		const data2 = await Member.updateById(req.params.id, {
			isMembershipActive: true,
			monthlyTimeRemaining: 28800000,
		});

		// return a 200 (OK) with the updated fields.
		res.status(200).send(data2);
	} catch (error) {

		// Return a 400 (Bad Request) for any failure.
		res.status(400).send({ error: error.message });
	}
});


// This endpoint will dactivate the membership of whichever member id is specified
// in the url.
router.patch("/member/:id/deactivate", async (req, res) => {
	try {
		const data = await Member.updateById(req.params.id, {
			isMembershipActive: false,
			monthlyTimeRemaining: 0,
		});
		console.log(`This member has ${0} minutes remaining`);

		// return a 200 (OK) with the updated fields.
		res.status(200).send(data);
	} catch (error) {

		// Return a 400 (Bad Request) for any failure.
		res.status(400).send({ error: error.message });
	}
});

// This endpoint is responsible for clocking members in and out.
router.put("/member/clock-in-out", async (req, res) => {
	try {

		// Find the member with the id inside the query of the request.
		const data = await Member.findById(req.query.id);

		// Retrieve the websocket instance so that we can send a message
		// to our terminal
		const wss = getWebSocketInstance();
		wss.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(`${data.first} ${data.last} has swiped their card!`);
			}
		});

		let response; // Will be used to send to the client

		// Return a 401 (Unauthorized) status if the swiped user is not an active member.
		if (data.isMembershipActive == false) {
			console.log("Member is not active!");
			res.status(401).send("Unauthorized: Membership is not active.");
			return;
		}
		// Clock out the user if they are presently clocked in.
		if (data.isClockOut == true) {
			console.log("Clocking out");

			// Subtract the time they clocked out from the time they clocked in to subtract
			// from their monthly allotted time.
			const timeRemaining =
				data.monthlyTimeRemaining - (Date.now() - data.lastClockInTime);
			console.log(
				`This member has ${timeRemaining / (1000 * 60)} minutes remaining`
			);
			response = await Member.updateById(req.query.id, {
				isClockOut: false,
				lastClockInTime: 0,
				monthlyTimeRemaining: timeRemaining,
			});
		} 

		// Clock in the user if they are presently clocked out.
		else if (data.isClockOut == false) {
			console.log("Clocking in");

			// Return a 401 (Unauthorized) status if the swiped member has no time remaining.
			if (data.monthlyTimeRemaining <= 0) {
				res.status(401).send("Unauthorized: Member has no time remaining.");
				return;
			}
			response = await Member.updateById(req.query.id, {
				isClockOut: true,
				lastClockInTime: Date.now(),
			});
		}

		// return a 200 (OK) with the updated fields.
		res.status(200).send(response);
	} catch (error) {
		// Return a 400 (Bad Request) for any failure.
		res.status(400).send({ error: error.message });
	}
});

module.exports = router;
