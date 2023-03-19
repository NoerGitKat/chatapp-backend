import { StatusCodes } from "http-status-codes";
import { IError } from "src/types";

export abstract class CustomError extends Error {
	abstract statusCode: number;
	abstract status: string;

	constructor(message: string) {
		super(message);
	}

	serializeErrors(): IError {
		return {
			message: this.message,
			status: this.status,
			statusCode: this.statusCode
		};
	}
}

export class BadRequestError extends CustomError {
	statusCode = StatusCodes.BAD_REQUEST;
	status = "error";

	constructor(message: string) {
		super(message);
	}
}

export class NotFoundError extends CustomError {
	statusCode = StatusCodes.NOT_FOUND;
	status = "error";

	constructor(message: string) {
		super(message);
	}
}

export class UnauthorizedError extends CustomError {
	statusCode = StatusCodes.UNAUTHORIZED;
	status = "error";

	constructor(message: string) {
		super(message);
	}
}

export class RequestTooLongError extends CustomError {
	statusCode = StatusCodes.REQUEST_TOO_LONG;
	status = "error";

	constructor(message: string) {
		super(message);
	}
}

export class ServerError extends CustomError {
	statusCode = StatusCodes.SERVICE_UNAVAILABLE;
	status = "error";

	constructor(message: string) {
		super(message);
	}
}
