import { drizzle, type BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import * as schema from "./schema";
import { Database } from "bun:sqlite";

export type Drizzle = BunSQLiteDatabase<typeof schema>;

export function databaseFactory(sqlite: Database): Drizzle {
	return drizzle(sqlite, { schema });
}
