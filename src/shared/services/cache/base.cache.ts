import Logger from "bunyan";
import { createClient } from "redis";
import { appConfig } from "src/config";

export type RedisClient = ReturnType<typeof createClient>;

export abstract class BaseCache {
	public client: RedisClient;
	private log: Logger;

	constructor(cacheName: string) {
		this.client = createClient({ url: appConfig.REDIS_HOST });
		this.log = appConfig.createLogger(cacheName);
		this.cacheError();
	}

	private cacheError(): void {
		this.client.on("error", (error: unknown) => {
			this.log.error(error);
		});
	}
}
