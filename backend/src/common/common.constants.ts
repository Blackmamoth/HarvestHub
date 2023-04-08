import { config } from "dotenv";
import moment from "moment";

config();

export const MONGO_URI = `${process.env.MONGO_URI}`;
export const COOKIE_SECRET = `${process.env.COOKIE_SECRET}`;
export const FARMER_ACCESS_TOKEN = `${process.env.FARMER_ACCESS_TOKEN}`;
export const FARMER_REFRESH_TOKEN = `${process.env.FARMER_REFRESH_TOKEN}`;
export const CONSUMER_ACCESS_TOKEN = `${process.env.CONSUMER_ACCESS_TOKEN}`;
export const CONSUMER_REFRESH_TOKEN = `${process.env.CONSUMER_REFRESH_TOKEN}`