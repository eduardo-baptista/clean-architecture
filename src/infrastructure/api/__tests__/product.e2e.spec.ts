import { expect, describe, it, beforeEach, afterEach } from "bun:test";
import { setupApp } from "../express";
import request from "supertest";
import type { Drizzle } from "../../db/drizzle/db";
import e, { type Express } from "express";
import { Product } from "../../../domain/product/entity/product";
import { ProductRepository } from "../../product/repository/drizzle/product.repository";

describe("E2E test for product", () => {
	let engine: Express;
	let db: Drizzle;

	beforeEach(async () => {
		const app = await setupApp();
		engine = app.engine;
		db = app.db;
	});

	it("should list all products", async () => {
		const product1 = new Product(crypto.randomUUID(), "Product 1", 100);
		const product2 = new Product(crypto.randomUUID(), "Product 2", 200);
		const productRepository = new ProductRepository(db);

		await Promise.all([
			productRepository.create(product1),
			productRepository.create(product2),
		]);

		const response = await request(engine).get("/product");

		expect(response.status).toBe(200);
		expect(response.body.products).toHaveLength(2);

		expect(response.body.products[0]).toStrictEqual({
			id: product1.id,
			name: product1.name,
			price: product1.price,
		});
		expect(response.body.products[1]).toStrictEqual({
			id: product2.id,
			name: product2.name,
			price: product2.price,
		});
	});
});
