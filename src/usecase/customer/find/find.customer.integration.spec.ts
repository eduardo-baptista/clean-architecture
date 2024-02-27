import { Database } from "bun:sqlite";
import { expect, it, describe, beforeEach, afterEach } from "bun:test";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import {
	databaseFactory,
	type Drizzle,
} from "../../../infrastructure/db/drizzle/db";
import { CustomerRepository } from "../../../infrastructure/customer/repository/drizzle/customer.repository";
import { Customer } from "../../../domain/customer/entity/customer";
import { Address } from "../../../domain/customer/value-object/address";
import { FindCustomerUseCase } from "./find.customer.usecase";

describe("Test find customer use case", () => {
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

	it("should find a customer", async () => {
		const customerRepository = new CustomerRepository(db);
		const customer = new Customer("123", "Customer 1");
		const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
		customer.changeAddress(address);
		await customerRepository.create(customer);
		const usecase = new FindCustomerUseCase(customerRepository);

		const input = { id: "123" };

		const output = {
			id: "123",
			name: "Customer 1",
			address: {
				street: "Street 1",
				number: 1,
				zip: "Zipcode 1",
				city: "City 1",
			},
		};

		const result = await usecase.execute(input);

		expect(result).toStrictEqual(output);
	});
});
