import { expect, it, describe, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import {
	databaseFactory,
	type Drizzle,
} from "../../../infrastructure/db/drizzle/db";
import { CustomerRepository } from "../../../infrastructure/customer/repository/drizzle/customer.repository";
import { CustomerFactory } from "../../../domain/customer/factory/customer.factory";
import { Address } from "../../../domain/customer/value-object/address";
import ListCustomerUseCase from "./list.customer.usecase";

describe("Test list customer use case", () => {
	let connection: Database;
	let db: Drizzle;

	beforeEach(async () => {
		connection = new Database(":memory:");
		db = databaseFactory(connection);
		await migrate(db, { migrationsFolder: "./drizzle" });
	});

	afterEach(async () => {
		connection.close();
	});

	it("should list a customer", async () => {
		const customerRepository = new CustomerRepository(db);
		const customer1 = CustomerFactory.createWithAddress(
			"Customer 1",
			new Address("Street 1", 1, "Zipcode 1", "City 1"),
		);
		const customer2 = CustomerFactory.createWithAddress(
			"Customer 2",
			new Address("Street 2", 2, "Zipcode 2", "City 2"),
		);
		await Promise.all([
			customerRepository.create(customer1),
			customerRepository.create(customer2),
		]);
		const usecase = new ListCustomerUseCase(customerRepository);

		const output = await usecase.execute({});

		expect(output.customers).toHaveLength(2);
		expect(output.customers[0].id).toBe(customer1.id);
		expect(output.customers[0].name).toBe(customer1.name);
		expect(output.customers[0].address.street).toBe(customer1.address.street);

		expect(output.customers[1].id).toBe(customer2.id);
		expect(output.customers[1].name).toBe(customer2.name);
		expect(output.customers[1].address.street).toBe(customer2.address.street);
	});
});
