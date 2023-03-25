import Logger from "bunyan";
import { appConfig } from "src/config";
import { BaseCache } from "./base.cache";

const log: Logger = appConfig.createLogger("redisConnection");

class RedisConnection extends BaseCache {
	constructor() {
		super("redisConnection");
	}

	async connect(): Promise<void> {
		try {
			await this.client.connect();
			const res = await this.client.ping();
			console.log(res);
		} catch (error) {
			log.error(error);
		}
	}
}

export const redisConnection: RedisConnection = new RedisConnection();
