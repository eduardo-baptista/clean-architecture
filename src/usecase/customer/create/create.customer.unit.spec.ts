import { describe, expect, it, jest } from "bun:test";
import { CreateCustomerUseCase } from "./create.customer.usecase";

const input = {
	name: "Customer 1",
	address: {
		street: "Street 1",
		number: 1,
		zip: "Zipcode 1",
		city: "City 1",
	},
};

const MockRepository = () => {
	return {
		create: jest.fn(),
		findById: jest.fn(),
		findAll: jest.fn(),
		update: jest.fn(),
	};
};

describe("Unit test create customer use case", () => {
	it("should create a customer", async () => {
		const customerRepository = MockRepository();
		const usecase = new CreateCustomerUseCase(customerRepository);

		const result = await usecase.execute(input);

		expect(result).toStrictEqual({
			id: expect.any(String),
			name: input.name,
			address: {
				street: input.address.street,
				number: input.address.number,
				zip: input.address.zip,
				city: input.address.city,
			},
		});
	});

	it("should thrown an error when name is missing", async () => {
		const customerRepository = MockRepository();
		const usecase = new CreateCustomerUseCase(customerRepository);

		const useCaseInput = {
			...input,
			name: "",
		};

		expect(async () => {
			await usecase.execute(useCaseInput);
		}).toThrow("Name is required");
	});

	it("should thrown an error when street is missing", async () => {
		const customerRepository = MockRepository();
		const usecase = new CreateCustomerUseCase(customerRepository);

		const useCaseInput = {
			...input,
			address: {
				...input.address,
				street: "",
			},
		};

		expect(async () => {
			await usecase.execute(useCaseInput);
		}).toThrow("Street is required");
	});
});
