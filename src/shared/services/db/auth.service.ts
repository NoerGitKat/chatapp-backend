import { AuthModel } from "src/features/auth/models/auth.schema";
import { IAuthDocument } from "src/features/auth/types/auth.interface";
import { Helpers } from "../../globals/helpers/helpers";

class AuthService {
	public async getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument> {
		const query = {
			$or: [
				{ username: Helpers.toUpperCaseFirstLetter(username) },
				{ email: Helpers.toLowerCase(email) }
			]
		};
		const user: IAuthDocument = (await AuthModel.findOne(query).exec()) as IAuthDocument;
		return user;
	}
}

export const authService: AuthService = new AuthService();
