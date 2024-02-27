import { describe, it, expect, jest } from "bun:test";
import { CustomerFactory } from "../../../domain/customer/factory/customer.factory";
import { Address } from "../../../domain/customer/value-object/address";
import ListCustomerUseCase from "./list.customer.usecase";

const customer1 = CustomerFactory.createWithAddress(
	"Customer 1",
	new Address("Street 1", 1, "Zipcode 1", "City 1"),
);

const customer2 = CustomerFactory.createWithAddress(
	"Customer 2",
	new Address("Street 2", 2, "Zipcode 2", "City 2"),
);

const MockRepository = () => {
	return {
		create: jest.fn(),
		findById: jest.fn(),
		findAll: jest.fn().mockResolvedValue([customer1, customer2]),
		update: jest.fn(),
	};
};

describe("Unit test list customer use case", () => {
	it("should list a customer", async () => {
		const repository = MockRepository();
		const usecase = new ListCustomerUseCase(repository);

		const output = await usecase.execute({});

		expect(output.customers).toHaveLength(2);
		expect(output.customers[0].id).toBe(customer1.id);
		expect(output.customers[0].name).toBe(customer1.name);
		expect(output.customers[0].address.street).toEqual(
			customer1.address.street,
		);

		expect(output.customers[1].id).toBe(customer2.id);
		expect(output.customers[1].name).toBe(customer2.name);
		expect(output.customers[1].address.street).toEqual(
			customer2.address.street,
		);
	});
});
