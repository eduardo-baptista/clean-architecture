import { describe, it, expect, jest } from "bun:test";
import { CustomerFactory } from "../../../domain/customer/factory/customer.factory";
import { Address } from "../../../domain/customer/value-object/address";
import { UpdateCustomerUseCase } from "./update.customer.usecase";

const customer = CustomerFactory.createWithAddress(
	"Customer 1",
	new Address("Street 1", 1, "Zipcode 1", "City 1"),
);

const input = {
	id: customer.id,
	name: "Customer Updated",
	address: {
		street: "Street Updated",
		number: 2,
		zip: "Zipcode Updated",
		city: "City Updated",
	},
};

const MockRepository = () => {
	return {
		create: jest.fn(),
		findById: jest.fn().mockResolvedValue(customer),
		findAll: jest.fn(),
		update: jest.fn(),
	};
};

describe("Unit test customer update use case", () => {
	it("should update a customer", async () => {
		const customerRepository = MockRepository();
		const usecase = new UpdateCustomerUseCase(customerRepository);

		const result = await usecase.execute(input);

		expect(result).toStrictEqual({
			id: input.id,
			name: input.name,
			address: {
				street: input.address.street,
				number: input.address.number,
				zip: input.address.zip,
				city: input.address.city,
			},
		});
	});
});
