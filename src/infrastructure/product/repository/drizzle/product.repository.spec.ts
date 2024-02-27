import { Database } from "bun:sqlite";
import { expect, it, describe, beforeEach, afterEach } from "bun:test";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { databaseFactory, type Drizzle } from "../../../db/drizzle/db";
import { Product } from "../../../../domain/product/entity/product";
import { ProductRepository } from "./product.repository";
import { products } from "../../../db/drizzle/schema";
import { eq } from "drizzle-orm";

describe("Product repository test", () => {
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
		const product = new Product("1", "Product 1", 100);

		await productRepository.create(product);

		const createdProduct = await db
			.select()
			.from(products)
			.where(eq(products.id, "1"))
			.limit(1);

		expect(createdProduct[0]).toStrictEqual({
			id: product.id,
			name: product.name,
			price: product.price,
		});
	});

	it("should update a product", async () => {
		const productRepository = new ProductRepository(db);
		const product = new Product("1", "Product 1", 100);

		await productRepository.create(product);

		product.changeName("Product 2");
		product.changePrice(200);

		await productRepository.update(product);

		const updatedProduct = await db
			.select()
			.from(products)
			.where(eq(products.id, "1"))
			.limit(1);

		expect(updatedProduct[0]).toStrictEqual({
			id: product.id,
			name: product.name,
			price: product.price,
		});
	});

	it("should find a product by id", async () => {
		const productRepository = new ProductRepository(db);
		const product = new Product("1", "Product 1", 100);

		await productRepository.create(product);

		const foundProduct = await productRepository.findById("1");

		expect(foundProduct).toStrictEqual(product);
	});

	it("should find all products", async () => {
		const productRepository = new ProductRepository(db);
		const product1 = new Product("1", "Product 1", 100);
		const product2 = new Product("2", "Product 2", 200);

		await productRepository.create(product1);
		await productRepository.create(product2);

		const foundedProducts = await productRepository.findAll();

		expect(foundedProducts).toStrictEqual([product1, product2]);
	});
});
