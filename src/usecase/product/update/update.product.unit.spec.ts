import { describe, it, expect, jest } from "bun:test";
import { Product } from "../../../domain/product/entity/product";
import { UpdateProductUseCase } from "./update.product.usecase";

const product = new Product(crypto.randomUUID(), "Product 1", 10);

const input = {
	id: product.id,
	name: "Product Updated",
	price: 20,
};

const MockRepository = () => {
	return {
		create: jest.fn(),
		findById: jest.fn().mockResolvedValue(product),
		findAll: jest.fn(),
		update: jest.fn(),
	};
};

describe("Unit test product update use case", () => {
	it("should update a product", async () => {
		const productRepository = MockRepository();
		const usecase = new UpdateProductUseCase(productRepository);

		const result = await usecase.execute(input);

		expect(result).toStrictEqual({
			id: input.id,
			name: input.name,
			price: input.price,
		});
	});
});
