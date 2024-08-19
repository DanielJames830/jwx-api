const WebSocket = require("ws"); // Ensure WebSocket is properly required at the top

let wss; // Initialize the WebSocket server variable

function createNewWebSocket(server) {
	if (!wss) {
		wss = new WebSocket.Server({ server: server });

		wss.on("connection", (ws) => {
			ws.isAlive = true;

			ws.on("pong", function () {
				ws.isAlive = true;
			});

			// Periodically check if the connection is alive
			const interval = setInterval(function ping() {
				if (ws.isAlive === false) {
					ws.terminate();
					clearInterval(interval);
					return;
				}

				ws.ping('Ping!'); // Send ping message
			}, 30000); // Adjust interval as needed (e.g., every 30 seconds)

			// Handle incoming messages
			ws.on("message", function incoming(message) {
				console.log("received: %s", message);
			});

			// Handle connection close
			ws.on("close", function close() {
				clearInterval(interval);
			});
		});
	}
	return wss;
}

function getWebSocketInstance() {
	if (!wss) {
		throw new Error(
			"WebSocket server not initialized. Call createNewWebSocket first."
		);
	}
	return wss;
}

module.exports = { createNewWebSocket, getWebSocketInstance };
