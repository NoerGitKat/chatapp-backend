import { object, ObjectSchema, ref, string } from "joi";

const emailSchema: ObjectSchema = object().keys({
	email: string().email().required().messages({
		"string.base": "Field must be valid",
		"string.required": "Field must be valid",
		"string.email": "Field must be valid"
	})
});

const passwordSchema: ObjectSchema = object().keys({
	password: string().required().min(4).max(8).messages({
		"string.base": "Password should be of type string",
		"string.min": "Invalid password",
		"string.max": "Invalid password",
		"string.empty": "Password is a required field"
	}),
	confirmPassword: string().required().valid(ref("password")).messages({
		"any.only": "Passwords should match",
		"any.required": "Confirm password is a required field"
	})
});

export { emailSchema, passwordSchema };
