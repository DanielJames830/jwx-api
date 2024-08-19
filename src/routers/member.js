const express = require("express");
const { verifyMemberData }= require('../middleware/verifyMemberData');
const router = express.Router();
const Member = require("../models/member");
const sgMail = require("@sendgrid/mail");
const { Query } = require("firefose");
const { getWebSocketInstance } = require("./webSocket");
const { WebSocket } = require("ws");

router.post("/member", async (req, res) => {
	console.log(req.body);
	try {
        await verifyMemberData(req.body);

		const data = await Member.create(req.body);
		res.status(201).send(data);
	} catch (e) {
		res.status(400).send({ error: e.message });
	}
});

router.get("/member", async (req, res) => {
	try {
		const data = await Member.findById(req.query.id);
		res.status(200).send(data);
	} catch (e) {
		res.status(400).send({ error: e.message });
	}
});

router.post("/members", async (req, res) => {
	const query = new Query().where('isClockOut', '==', req.body.isClockOut)
	try {
		const data = await Member.find(query);
		res.status(200).send(data);
	} catch (e) {
		res.status(400).send({ error: e.message });
	}
});

router.patch("/member/:id/activate", async (req, res) => {
	try {
		const data = await Member.findById(req.params.id);
		console.log(
			`This member has been allotted ${21600000 / (1000 * 60)} minutes`
		);
		const data2 = await Member.updateById(req.params.id, {
			isMembershipActive: true,
			monthlyTimeRemaining: 21600000,
		});
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);
		const msg = {
			to: data.email,
			from: "daniel.manley@juiceworks3d.com",
			subject: "Welcome to the club!",
			templateId: "d-b280ed837f3345d39b9fe3728f594197",
			dynamic_template_data: {
				firstName: data.first,
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

		res.status(200).send(data2);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

router.patch("/member/:id/deactivate", async (req, res) => {
	try {
		const data = await Member.updateById(req.params.id, {
			isMembershipActive: false,
			monthlyTimeRemaining: 0,
		});
		console.log(`This member has ${0} minutes remaining`);
		res.status(200).send(data);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

router.put("/member/clock-in-out", async (req, res) => {
	try {
		const data = await Member.findById(req.query.id);
		const wss = getWebSocketInstance();
		wss.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(`${data.first} ${data.last} has swiped their card!`);
			}
		});
		let response;
		if (data.isMembershipActive == false) {
			console.log("Member is not active!");
			res.status(401).send("Unauthorized: Membership is not active.");
			return;
		}

		if (data.isClockOut == true) {
			console.log("Clocking out");
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
		} else if (data.isClockOut == false) {
			console.log("Clocking in");
			if (data.monthlyTimeRemaining <= 0) {
				res.status(401).send("Unauthorized: Member has no time remaining.");
				return;
			}
			response = await Member.updateById(req.query.id, {
				isClockOut: true,
				lastClockInTime: Date.now(),
			});
		}

		res.status(200).send(response);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

module.exports = router;
