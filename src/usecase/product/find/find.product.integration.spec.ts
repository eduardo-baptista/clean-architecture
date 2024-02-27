import { expect, it, describe, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import {
	databaseFactory,
	type Drizzle,
} from "../../../infrastructure/db/drizzle/db";
import { ProductRepository } from "../../../infrastructure/product/repository/drizzle/product.repository";
import { Product } from "../../../domain/product/entity/product";
import { FindProductUseCase } from "./find.product.usecase";

describe("Test find product use case", () => {
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

	it("should find a product", async () => {
		const productRepository = new ProductRepository(db);
		const product = new Product("123", "Product 1", 100);
		await productRepository.create(product);

		const usecase = new FindProductUseCase(productRepository);

		const output = await usecase.execute({ id: "123" });

		expect(output).toStrictEqual({
			id: product.id,
			name: product.name,
			price: product.price,
		});
	});

	it("should not find a product", async () => {
		const productRepository = new ProductRepository(db);
		const usecase = new FindProductUseCase(productRepository);

		expect(async () => {
			await usecase.execute({ id: "123" });
		}).toThrow("Product not found");
	});
});
