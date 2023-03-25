import Logger from "bunyan";
import { connect, connection } from "mongoose";
import { appConfig } from "src/config";
import { redisConnection } from "src/shared/services/cache/";

const log: Logger = appConfig.createLogger("database");

async function connectToDB(): Promise<void> {
	await connect(appConfig.MONGO_URI || "mongodb://localhost:27017/chatapp-backend");
	log.info("Successfully connected to the database!");
}

export default async function startDatabase() {
	try {
		await connectToDB();
		redisConnection.connect();
	} catch (err) {
		log.error(err);
		return process.exit(1);
	}

	connection.on("disconnected", connectToDB);
}
