import { expect, describe, it, jest } from "bun:test";
import { CreateProductUseCase } from "./create.product.usecase";

const input = {
	name: "Product 1",
	price: 100,
};

const MockRepository = () => {
	return {
		create: jest.fn(),
		findById: jest.fn(),
		findAll: jest.fn(),
		update: jest.fn(),
	};
};

describe("Unit test create product use case", () => {
	it("should create a product", async () => {
		const productRepository = MockRepository();
		const usecase = new CreateProductUseCase(productRepository);

		const result = await usecase.execute(input);

		expect(result).toStrictEqual({
			id: expect.any(String),
			name: input.name,
			price: input.price,
		});
	});
});
