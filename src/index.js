require("dotenv").config({ path: '.env'});


// Server requirements
const express = require("express");
const cors = require("cors");
const functions = require("firebase-functions");


// Define routers here
const testRouter = require("./routers/test");
const memberRouter = require("./routers/member");
const { connect } = require("firefose");
const app = express();

// Configure express to allow requests from anywhere
app.use(cors());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

// Configure express to read JSON objects in the body of requests.
app.use(express.json());

// Define routers here
app.use(testRouter);
app.use(memberRouter);

// Set up a default route ('') and return 'Hello World!' in the
// response when requests are received
app.get("/", (req, res) => {
	res.send("Hello World!");
});

async function initializeFirebase() {
	const credentials = JSON.parse(process.env.ACCOUNT_KEY);

	await connect(credentials, "databaseURI");
}

initializeFirebase();

// Set port to the PORT environment variable (if it is defined),
// otherwise set it to 3000
const port = 3000;

// Configure the server to listen for connections on the port.
// Print to the console when ready for connections
app.listen(port, () => {
	console.log("Server is up on port " + port);
});

exports.api = functions.https.onRequest(server);