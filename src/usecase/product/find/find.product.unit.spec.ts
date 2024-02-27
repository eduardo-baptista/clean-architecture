import { expect, it, describe, jest } from "bun:test";
import { Product } from "../../../domain/product/entity/product";
import { FindProductUseCase } from "./find.product.usecase";

const product = new Product("123", "Product 1", 100);

const MockRepository = () => {
	return {
		create: jest.fn(),
		findById: jest.fn().mockResolvedValue(product),
		findAll: jest.fn(),
		update: jest.fn(),
	};
};

describe("Unit Test find product use case", () => {
	it("should find a product", async () => {
		const productRepository = MockRepository();
		const usecase = new FindProductUseCase(productRepository);

		const input = { id: "123" };

		const output = {
			id: "123",
			name: "Product 1",
			price: 100,
		};

		const result = await usecase.execute(input);

		expect(result).toStrictEqual(output);
	});

	it("should not find a product", async () => {
		const productRepository = MockRepository();
		productRepository.findById.mockImplementation(() => {
			throw new Error("Product not found");
		});
		const usecase = new FindProductUseCase(productRepository);

		const input = { id: "123" };

		expect(async () => {
			await usecase.execute(input);
		}).toThrow("Product not found");
	});
});
