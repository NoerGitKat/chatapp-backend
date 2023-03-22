import express, { Express } from "express";
import { appConfig } from "./config";
import { ChatServer } from "./utils";
import startDatabase from "./utils/startDatabase";

class Main {
	public initialize(): void {
		this.loadConfig();
		const app: Express = express();
		const server: ChatServer = new ChatServer(app);

		startDatabase();
		server.start();
	}

	private loadConfig(): void {
		appConfig.validateConfig();
		appConfig.cloudinaryConfig();
	}
}

const application: Main = new Main();
application.initialize();
