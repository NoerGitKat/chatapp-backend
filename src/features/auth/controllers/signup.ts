import { UploadApiResponse } from "cloudinary";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import { validateJoi } from "src/shared/globals/decorators/joi-validation.decorators";
import { BadRequestError } from "src/shared/globals/helpers/error-handlers";
import { Helpers } from "src/shared/globals/helpers/helpers";
import { uploadToCloudinary } from "src/shared/globals/helpers/upload-to-cloudinary";
import { authService } from "src/shared/services/db/auth.service";
import { IAuthDocument, ISignUpData } from "../interfaces/auth.interface";
import { signupSchema } from "../schemas/signup";

export class SignUp {
	@validateJoi(signupSchema)
	public async create(req: Request, res: Response): Promise<void> {
		const { username, email, password, avatarColor, avatarImage } = req.body;
		const userExists: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);

		if (userExists) {
			throw new BadRequestError("User already exists.");
		}

		const authObjectId: ObjectId = new ObjectId(); // Create custom object id to reuse in Redis
		const userObjectId: ObjectId = new ObjectId(); // Create custom object id to reuse in Redis
		const uId = `${Helpers.generateRandomIntegers(12)}`;

		const authData: IAuthDocument = SignUp.prototype.signupData({
			_id: authObjectId,
			uId,
			username,
			email,
			password,
			avatarColor
		});

		const uploadResult: UploadApiResponse = (await uploadToCloudinary(
			avatarImage,
			`${userObjectId}`,
			true,
			true
		)) as UploadApiResponse;

		if (!uploadResult?.public_id) {
			throw new BadRequestError("File upload error. Try again.");
		}

		res.status(StatusCodes.CREATED).json({ message: "User created successfully!", authData });
	}

	private signupData(data: ISignUpData): IAuthDocument {
		const { _id, username, email, uId, password, avatarColor } = data;
		return {
			_id,
			username: Helpers.toUpperCaseFirstLetter(username),
			email: Helpers.toLowerCase(email),
			uId,
			password,
			avatarColor,
			createdAt: new Date()
		} as IAuthDocument;
	}
}
