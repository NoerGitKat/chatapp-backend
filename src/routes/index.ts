import { Application } from "express";

export default function getRoutes(app: Application) {
	const routes = () => {
		app.use("/api/v1", () => {});
	};
	routes();
}
