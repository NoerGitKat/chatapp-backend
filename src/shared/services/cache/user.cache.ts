import Logger from "bunyan";
import { appConfig } from "src/config";
import { ServerError } from "src/shared/globals/helpers/error-handlers";
import { IUserDocument } from "./../../../features/user/interfaces/user.interface";
import { BaseCache } from "./base.cache";

const log: Logger = appConfig.createLogger("userCache");

class UserCache extends BaseCache {
	constructor() {
		super("userCachce");
	}

	public async saveUserToCache(
		key: string,
		userId: string,
		createdUser: IUserDocument
	): Promise<void> {
		const {
			_id,
			authId,
			username,
			email,
			password,
			avatarColor,
			uId,
			postsCount,
			work,
			school,
			quote,
			location,
			blocked,
			blockedBy,
			followersCount,
			followingCount,
			notifications,
			social,
			bgImageVersion,
			bgImageId,
			profilePicture,
			createdAt
		} = createdUser;
		const dataToSave = {
			_id: `${_id}`,
			uId: `${uId}`,
			username: `${username}`,
			email: `${email}`,
			avatarColor: `${avatarColor}`,
			createdAt: `${createdAt}`,
			postsCount: `${postsCount}`,
			blocked: JSON.stringify(blocked),
			blockedBy: JSON.stringify(blockedBy),
			profilePicture: `${profilePicture}`,
			followersCount: `${followersCount}`,
			followingCount: `${followingCount}`,
			notifications: JSON.stringify(notifications),
			social: JSON.stringify(social),
			work: `${work}`,
			location: `${location}`,
			school: `${school}`,
			quote: `${quote}`,
			bgImageVersion: `${bgImageVersion}`,
			bgImageId: `${bgImageId}`
		};

		try {
			if (!this.client.isOpen) {
				await this.client.connect();
			}
			await this.client.ZADD("user", { score: parseInt(userId, 10), value: `${key}` });
			for (const [itemKey, itemValue] of Object.entries(dataToSave)) {
				await this.client.HSET(`users:${key}`, `${itemKey}`, `${itemValue}`);
			}
		} catch (error) {
			log.error(error);
			throw new ServerError("Server error. Try again.");
		}
	}
}

export const userCache: UserCache = new UserCache();
