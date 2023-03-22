import { Application } from "express";
import { API_BASE_PATH } from "src/constants";
import { authRoutes } from "./../features/auth/routes/authRoutes";

export default function getRoutes(app: Application) {
	const routes = () => {
		app.use(`${API_BASE_PATH}/auth`, authRoutes.getRoutes());
	};
	routes();
}
