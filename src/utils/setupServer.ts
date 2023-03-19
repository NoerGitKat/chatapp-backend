import { createAdapter } from "@socket.io/redis-adapter";
import compression from "compression";
import session from "cookie-session";
import cors from "cors";
import { Application, json, urlencoded } from "express";
import "express-async-errors";
import helmet from "helmet";
import hpp from "hpp";
import { Server as HttpServer } from "http";
import { createClient } from "redis";
import { Server as SocketServer } from "socket.io";
import { appConfig } from "src/config";
import getRoutes from "src/routes";
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
				keys: [appConfig.SECRET_KEY_1!, appConfig.SECRET_KEY_2!],
				maxAge: 1 * WEEK,
				secure: appConfig.NODE_ENV !== "development"
			})
		);

		app.use(hpp()); // Protect against HTTP Parameter Pollution attacks
		app.use(helmet()); // Sets various HTTP headers
		app.use(
			cors({
				origin: appConfig.CLIENT_BASEURL || "*",
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
	private routeMiddleware(app: Application): void {
		getRoutes(app);
	}
	private globalErrorHandler(app: Application): void {}

	private async startServer(app: Application): Promise<void> {
		try {
			const httpServer: HttpServer = new HttpServer(app);
			const socketIO: SocketServer = await this.createSocketIO(httpServer);
			this.startHttpServer(httpServer);
			this.socketIOConnections(socketIO);
		} catch (error) {
			console.error(error);
		}
	}

	private async createSocketIO(httpServer: HttpServer): Promise<SocketServer> {
		const io: SocketServer = new SocketServer(httpServer, {
			cors: {
				origin: appConfig.CLIENT_BASEURL || "*",
				methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
			}
		});
		const pubClient = createClient({ url: appConfig.REDIS_HOST });
		const subClient = pubClient.duplicate();
		try {
			await Promise.all([pubClient.connect(), subClient.connect()]);
		} catch (error) {
			console.error(error);
		}
		io.adapter(createAdapter(pubClient, subClient));
		return io;
	}

	private socketIOConnections(io: SocketServer): void {}

	private startHttpServer(httpServer: HttpServer): void {
		console.log(`The server has started with process ${process.pid}`);
		httpServer.listen(SERVER_PORT, function runServer() {
			console.log(`The server is running on port: ${SERVER_PORT}!`);
		});
	}
}

export default ChatServer;
