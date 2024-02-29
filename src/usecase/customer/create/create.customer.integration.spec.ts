import { expect, it, describe, beforeEach, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import {
	databaseFactory,
	type Drizzle,
} from "../../../infrastructure/db/drizzle/db";
import { CustomerRepository } from "../../../infrastructure/customer/repository/drizzle/customer.repository";
import { CreateCustomerUseCase } from "./create.customer.usecase";

describe("Test create customer use case", () => {
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

	it("should create a customer", async () => {
		const customerRepository = new CustomerRepository(db);
		const usecase = new CreateCustomerUseCase(customerRepository);

		const input = {
			name: "Eduardo",
			address: {
				street: "street",
				number: 1,
				zip: "zip",
				city: "city",
			},
		};

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
});
