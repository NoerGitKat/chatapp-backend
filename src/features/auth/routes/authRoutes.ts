import { Router } from "express";
import { SignUp } from "../controllers/signup";

class AuthRoutes {
	private router: Router;

	constructor() {
		this.router = Router();
	}

	public getRoutes(): Router {
		this.router.route("/signup").post(SignUp.prototype.create);

		return this.router;
	}
}

export const authRoutes: AuthRoutes = new AuthRoutes();
