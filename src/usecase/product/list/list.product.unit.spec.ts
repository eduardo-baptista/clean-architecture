import { describe, expect, it, jest } from "bun:test";
import { Product } from "../../../domain/product/entity/product";
import { ListProductUseCase } from "./list.product.usecase";

const product1 = new Product("1", "Product 1", 10);
const product2 = new Product("2", "Product 2", 20);

const MockRepository = () => {
	return {
		create: jest.fn(),
		findById: jest.fn(),
		findAll: jest.fn().mockResolvedValue([product1, product2]),
		update: jest.fn(),
	};
};

describe("Unit test list product use case", () => {
	it("should list a product", async () => {
		const repository = MockRepository();
		const usecase = new ListProductUseCase(repository);

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
