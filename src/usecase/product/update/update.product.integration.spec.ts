import { expect, it, describe, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import {
	databaseFactory,
	type Drizzle,
} from "../../../infrastructure/db/drizzle/db";
import { ProductRepository } from "../../../infrastructure/product/repository/drizzle/product.repository";
import { UpdateProductUseCase } from "./update.product.usecase";
import { Product } from "../../../domain/product/entity/product";

describe("Test update product use case", () => {
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

	it("should update a product", async () => {
		const productRepository = new ProductRepository(db);
		const product = new Product(crypto.randomUUID(), "Product 1", 10);
		await productRepository.create(product);

		const usecase = new UpdateProductUseCase(productRepository);

		const input = {
			id: product.id,
			name: "Product Updated",
			price: 20,
		};

		const result = await usecase.execute(input);

		expect(result).toStrictEqual({
			id: input.id,
			name: input.name,
			price: input.price,
		});
	});
});
