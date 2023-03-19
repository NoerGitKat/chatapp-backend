import express, { Express } from "express";
import { ChatServer } from "./utils";

class Main {
	public initialize(): void {
		const app: Express = express();
		const server: ChatServer = new ChatServer(app);
		server.start();
	}
}

const application: Main = new Main();
application.initialize();
