import { describe, it, expect } from "bun:test";
import { ProductFactory } from "./product.factory";

describe("Product Factory unit test", () => {
	it("should create a product type A", () => {
		const product = ProductFactory.create("a", "Product A", 10);
		expect(product.id).toBeDefined();
		expect(product.name).toBe("Product A");
		expect(product.price).toBe(10);
		expect(product.constructor.name).toBe("Product");
	});

	it("should create a product type B", () => {
		const product = ProductFactory.create("b", "Product B", 10);
		expect(product.id).toBeDefined();
		expect(product.name).toBe("Product B");
		expect(product.price).toBe(20);
		expect(product.constructor.name).toBe("ProductB");
	});

	it("should throw an error when creating an invalid product type", () => {
		expect(() => ProductFactory.create("c", "Product C", 10)).toThrow(
			"Invalid product type",
		);
	});
});
