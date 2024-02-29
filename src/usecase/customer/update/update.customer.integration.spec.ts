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
import { UpdateCustomerUseCase } from "./update.customer.usecase";

describe("Test update customer use case", () => {
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

	it("should update a customer", async () => {
		const customerRepository = new CustomerRepository(db);
		const customer = CustomerFactory.createWithAddress(
			"Customer",
			new Address("Street", 1, "Zip", "City"),
		);
		await customerRepository.create(customer);

		const usecase = new UpdateCustomerUseCase(customerRepository);

		const input = {
			id: customer.id,
			name: "Customer Updated",
			address: {
				street: "Street Updated",
				number: 2,
				zip: "Zip Updated",
				city: "City Updated",
			},
		};

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
