import { config } from "dotenv";
config();

export const HOUR = 3600000;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;

export const SERVER_PORT = process.env.PORT || 4000;
