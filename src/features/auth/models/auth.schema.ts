import { compare, hash } from "bcryptjs";
import { model, Model, Schema } from "mongoose";
import { IAuthDocument } from "../types/auth.interface";

const SALT_ROUND = 10;

const authSchema: Schema = new Schema(
	{
		username: { type: String },
		uId: { type: String },
		email: { type: String },
		password: { type: String },
		avatarColor: { type: String },
		createdAt: { type: Date, default: Date.now },
		passwordResetToken: { type: String, default: "" },
		passwordResetExpires: { type: Number }
	},
	{
		toJSON: {
			transform(_doc, retrievedDoc) {
				delete retrievedDoc.password;
				return retrievedDoc;
			}
		}
	}
);

authSchema.pre("save", async function (this: IAuthDocument, next: () => void) {
	const hashedPassword: string = await hash(this.password as string, SALT_ROUND);
	this.password = hashedPassword;
	next();
});

authSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
	const hashedPassword: string = (this as unknown as IAuthDocument).password!;
	return compare(password, hashedPassword);
};

authSchema.methods.hashPassword = async function (password: string): Promise<string> {
	return hash(password, SALT_ROUND);
};

const AuthModel: Model<IAuthDocument> = model<IAuthDocument>("AuthUser", authSchema, "AuthUser");
export { AuthModel };
