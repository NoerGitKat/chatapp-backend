import { connect, connection } from "mongoose";
import { appConfig } from "src/config";

async function connectToDB(): Promise<void> {
	await connect(appConfig.MONGO_URI || "mongodb://localhost:27017/chatapp-backend");
	console.log("Successfully connected to the database!");
}

export default async function startDatabase() {
	try {
		await connectToDB();
	} catch (err) {
		console.error(err);
		return process.exit(1);
	}

	connection.on("disconnected", connectToDB);
}
