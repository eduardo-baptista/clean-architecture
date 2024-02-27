import { expect, it, describe, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import {
	databaseFactory,
	type Drizzle,
} from "../../../infrastructure/db/drizzle/db";
import { ProductRepository } from "../../../infrastructure/product/repository/drizzle/product.repository";
import { CreateProductUseCase } from "./create.product.usecase";

describe("Test create product use case", () => {
	let connection: Database;
	let db: Drizzle;

	beforeEach(async () => {
		connection = new Database(":memory:");
		db = databaseFactory(connection);
		await migrate(db, { migrationsFolder: "./drizzle" });
	});

	afterEach(async () => {
		connection.close();
	});

	it("should create a product", async () => {
		const productRepository = new ProductRepository(db);
		const usecase = new CreateProductUseCase(productRepository);

		const input = {
			name: "Product 1",
			price: 100,
		};

		const result = await usecase.execute(input);

		expect(result).toStrictEqual({
			id: expect.any(String),
			name: input.name,
			price: input.price,
		});
	});
});
