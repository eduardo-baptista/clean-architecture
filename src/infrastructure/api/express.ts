import { Database } from "bun:sqlite";
import { databaseFactory, type Drizzle } from "../db/drizzle/db";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import express from "express";
import { customerRouter } from "./routes/customer.route";
import { productRouter } from "./routes/product.route";

declare global {
	namespace Express {
		export interface Request {
			db: Drizzle;
		}
	}
}

export interface App {
	engine: express.Express;
	db: Drizzle;
}

export async function setupApp(): Promise<App> {
	const app = express();

	app.use(express.json());

	const connection = new Database(":memory:");
	const db = databaseFactory(connection);
	await migrate(db, { migrationsFolder: "./drizzle" });
	app.use((req, res, next) => {
		req.db = db;
		next();
	});

	app.use(customerRouter);
	app.use(productRouter);

	return { engine: app, db };
}
