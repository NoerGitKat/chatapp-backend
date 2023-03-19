import compression from "compression";
import session from "cookie-session";
import cors from "cors";
import { Application, json, urlencoded } from "express";
import "express-async-errors";
import helmet from "helmet";
import hpp from "hpp";
import { Server } from "http";
import { SERVER_PORT, WEEK } from "../constants";

class ChatServer {
	private app: Application;

	constructor(app: Application) {
		this.app = app;
	}

	public start(): void {
		this.securityMiddleware(this.app);
		this.standardMiddleware(this.app);
		this.routeMiddleware(this.app);
		this.globalErrorHandler(this.app);
		this.startServer(this.app);
	}

	private securityMiddleware(app: Application): void {
		app.use(
			session({
				name: "newSession",
				keys: ["test-key"],
				maxAge: 1 * WEEK,
				secure: false // TODO: Change when in prod
			})
		);

		app.use(hpp()); // Protect against HTTP Parameter Pollution attacks
		app.use(helmet()); // Sets various HTTP headers
		app.use(
			cors({
				origin: "*",
				credentials: true,
				optionsSuccessStatus: 200,
				methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
			})
		);
	}
	private standardMiddleware(app: Application): void {
		app.use(compression()); // Compress response bodies for all requests based on the given options
		app.use(json({ limit: "50mb" }));
		app.use(urlencoded({ extended: true, limit: "50mb" }));
	}
	private routeMiddleware(app: Application): void {}
	private globalErrorHandler(app: Application): void {}

	private startServer(app: Application): void {
		try {
			const httpServer: Server = new Server(app);
			this.startHttpServer(httpServer);
		} catch (error) {
			console.error(error);
		}
	}
	private createSocketIO(httpServer: Server): void {}

	private startHttpServer(httpServer: Server): void {
		httpServer.listen(SERVER_PORT, function runServer() {
			console.log(`The server is running on port: ${SERVER_PORT}!`);
		});
	}
}

export default ChatServer;
