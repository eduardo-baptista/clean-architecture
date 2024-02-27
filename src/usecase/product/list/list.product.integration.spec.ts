import { expect, it, describe, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import {
	databaseFactory,
	type Drizzle,
} from "../../../infrastructure/db/drizzle/db";
import { ProductRepository } from "../../../infrastructure/product/repository/drizzle/product.repository";
import { Product } from "../../../domain/product/entity/product";
import { ListProductUseCase } from "./list.product.usecase";

describe("Test list product use case", () => {
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

	it("should list a product", async () => {
		const productRepository = new ProductRepository(db);
		const product1 = new Product("1", "Product 1", 10);
		const product2 = new Product("2", "Product 2", 20);
		await Promise.all([
			productRepository.create(product1),
			productRepository.create(product2),
		]);
		const usecase = new ListProductUseCase(productRepository);

		const output = await usecase.execute({});
		expect(output.products).toHaveLength(2);
		expect(output.products[0].id).toBe(product1.id);
		expect(output.products[0].name).toBe(product1.name);
		expect(output.products[0].price).toBe(product1.price);

		expect(output.products[1].id).toBe(product2.id);
		expect(output.products[1].name).toBe(product2.name);
		expect(output.products[1].price).toBe(product2.price);
	});
});
