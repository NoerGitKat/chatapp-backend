import { createLogger } from "bunyan";
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();

class AppConfig {
	public MONGO_URI: string | undefined;
	public NODE_ENV: string | undefined;
	public SECRET_KEY_1: string | undefined;
	public SECRET_KEY_2: string | undefined;
	public CLIENT_BASEURL: string | undefined;
	public JWT_TOKEN: string | undefined;
	public REDIS_HOST: string | undefined;
	public CLOUDINARY_NAME: string | undefined;
	public CLOUDINARY_API_KEY: string | undefined;
	public CLOUDINARY_API_SECRET: string | undefined;

	private readonly DEFAULT_MONGO_URI = "mongodb://localhost:27017/chatapp-backend";

	constructor() {
		this.MONGO_URI = process.env.MONGO_URI || this.DEFAULT_MONGO_URI;
		this.NODE_ENV = process.env.NODE_ENV || "development";
		this.SECRET_KEY_1 = process.env.SECRET_KEY_1 || "";
		this.SECRET_KEY_2 = process.env.SECRET_KEY_2 || "";
		this.CLIENT_BASEURL = process.env.CLIENT_BASEURL || "";
		this.JWT_TOKEN = process.env.JWT_TOKEN || "";
		this.REDIS_HOST = process.env.REDIS_HOST || "";
		this.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME || "";
		this.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
		this.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";
	}

	public createLogger(name: string) {
		return createLogger({ name, level: "debug" });
	}

	public validateConfig(): void {
		for (const [key, value] of Object.entries(this)) {
			if (value === undefined) throw new Error(`Configuration ${key} is undefined.`);
		}
	}

	public cloudinaryConfig(): void {
		cloudinary.config({
			cloud_name: this.CLOUDINARY_NAME,
			api_key: this.CLOUDINARY_API_KEY,
			api_secret: this.CLOUDINARY_API_SECRET
		});
	}
}

export const appConfig: AppConfig = new AppConfig();
