import { describe, expect, it } from "bun:test";
import { Customer } from "./customer";
import { Address } from "../value-object/address";

describe("Customer unit tests", () => {
	it("should throw error when id is empty", () => {
		expect(() => new Customer("", "Eduardo")).toThrow(
			"customer: Id is required",
		);
	});

	it("should throw error when name is empty", () => {
		expect(() => new Customer("123", "")).toThrow("customer: Name is required");
	});

	it("should throw error when name and id are empty", () => {
		expect(() => new Customer("", "")).toThrow(
			"customer: Id is required,customer: Name is required",
		);
	});

	it("should register event when create a customer", () => {
		const customer = Customer.create("123", "Name");

		expect(customer.id).toBe("123");
		expect(customer.events).toHaveLength(1);
	});

	it("should change name", () => {
		const customer = new Customer("123", "Name");
		customer.changeName("New Name");

		expect(customer.name).toBe("New Name");
	});

	it("should register event when change address", () => {
		const customer = new Customer("123", "Name");
		const address = new Address("Rua 1", 123, "12345-123", "São Paulo");

		customer.changeAddress(address);

		expect(customer.address).toBe(address);
		expect(customer.events).toHaveLength(1);
	});

	it("should activate customer", () => {
		const customer = new Customer("123", "Name");
		const address = new Address("Rua 1", 123, "12345-123", "São Paulo");
		customer.changeAddress(address);
		customer.activate();

		expect(customer.isActive()).toBe(true);
	});

	it("should throw error when address is undefined when activate a customer", () => {
		const customer = new Customer("123", "Name");
		expect(() => customer.activate()).toThrow(
			"Address is mandatory to activate customer",
		);
	});

	it("should deactivate customer", () => {
		const customer = new Customer("123", "Name");
		customer.deactivate();

		expect(customer.isActive()).toBe(false);
	});

	it("should add reward points", () => {
		const customer = new Customer("123", "Name");
		expect(customer.rewardPoints).toBe(0);

		customer.addRewardPoints(10);

		expect(customer.rewardPoints).toBe(10);

		customer.addRewardPoints(20);

		expect(customer.rewardPoints).toBe(30);
	});
});
