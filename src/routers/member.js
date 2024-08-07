const express = require("express");
const { getFirestore } = require("firebase-admin/firestore");
const router = express.Router();
const Member = require("../models/member");
const { Query } = require("firefose");

router.post("/member", async (req, res) => {
	console.log(req.body);
	try {
		const data = await Member.create(req.body);
		res.status(201).send(data);
	} catch (e) {
		res.status(400).send({ error: e.message });
	}
});

router.get("/member", async (req, res) => {
	try {
		const data = await Member.findById(req.body.id);
		res.status(200).send(data);
	} catch (e) {
		res.status(400).send({ error: e.message });
	}
});

router.patch("/member/:id/activate", async (req, res) => {
	try {
		const data = await Member.updateById(req.params.id, {
			isMembershipActive: true,
            monthlyTimeRemaining: 21600000
		});
        console.log(`This member has been allotted ${21600000 / (1000 * 60)} minutes`)
		res.status(200).send(data);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

router.patch("/member/:id/deactivate", async (req, res) => {
	try {
		const data = await Member.updateById(req.params.id, {
			isMembershipActive: false,
            monthlyTimeRemaining: 0
		});
        console.log(`This member has ${0} minutes remaining`)
		res.status(200).send(data);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});

router.put("/member/:id/clock-in-out", async (req, res) => {
	try {
		const data = await Member.findById(req.params.id);

        let response;
        if(data.isMembershipActive == false) {
            console.log('Member is not active!')
            res.status(401).send("Unauthorized: Membership is not active.")
            return;
        }

		
		if (data.isClockOut == true) {
            console.log('Clocking out');
            const timeRemaining = data.monthlyTimeRemaining - (Date.now() - data.lastClockInTime);
            console.log(`This member has ${timeRemaining / (1000 * 60)} minutes remaining`)
			response = await Member.updateById(req.params.id, { isClockOut: false, lastClockInTime: 0, monthlyTimeRemaining: timeRemaining});
		} else if(data.isClockOut == false) {
            console.log('Clocking in');
            if(data.monthlyTimeRemaining <= 0) {
                res.status(401).send("Unauthorized: Member has no time remaining.");
                return;
            }
			response = await Member.updateById(req.params.id, {
				isClockOut: true,
				lastClockInTime: Date.now(),
			});
		}

		res.status(200).send(data);
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
});



module.exports = router;
