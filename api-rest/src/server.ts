import { app } from "./app.js";
import { env } from "./config/env.js"
import { logger } from "./utils/logger.js";

const server = app.listen(env.PORT || 3000, () => {
	JSON.stringify(logger.info(
		{ port: env.PORT },
		"Product Management API started",
	));

	console.log(`SERVER RUNNING ON http://localhost:${env.PORT || 3000}`)
});

function shutDown() {
	logger.info("Shutting down server");

	server.close((error) => {
		if (error) {
			logger.error({ err: error }, "Error closing server");
			process.exitCode = 1;
			return;
		}
		logger.info("Server closed")
	})
}

process.on("SIGINT", shutDown)
process.on("SIGTERM", shutDown)