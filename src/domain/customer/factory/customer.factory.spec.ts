import { expect, it, describe } from "bun:test";
import { CustomerFactory } from "./customer.factory";
import { Address } from "../value-object/address";

describe("Customer Factory unit test", () => {
	it("should create a customer", () => {
		const customer = CustomerFactory.create("name");

		expect(customer.id).toBeDefined();
		expect(customer.name).toBe("name");
	});

	it("should create a customer with an address", () => {
		const address = new Address("street", 12, "city", "zip");
		const customer = CustomerFactory.createWithAddress("name", address);

		expect(customer.id).toBeDefined();
		expect(customer.name).toBe("name");
		expect(customer.address).toBe(address);
	});
});
