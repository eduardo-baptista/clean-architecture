import { Database } from "bun:sqlite";
import { expect, it, describe, beforeEach, afterEach } from "bun:test";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { databaseFactory, type Drizzle } from "../../../db/drizzle/db";
import { Customer } from "../../../../domain/customer/entity/customer";
import { Address } from "../../../../domain/customer/value-object/address";
import { customers } from "../../../db/drizzle/schema";
import { eq } from "drizzle-orm";
import { CustomerRepository } from "./customer.repository";

describe("Customer repository test", () => {
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
		const customer = new Customer("123", "Customer 1");
		const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
		customer.changeAddress(address);
		await customerRepository.create(customer);

		const createdCustomer = await db
			.select()
			.from(customers)
			.where(eq(customers.id, customer.id));

		expect(createdCustomer[0]).toStrictEqual({
			id: customer.id,
			name: customer.name,
			isActive: customer.isActive(),
			rewardPoints: customer.rewardPoints,
			street: address.street,
			number: address.number,
			zipCode: address.zip,
			city: address.city,
		});
	});

	it("should update a customer", async () => {
		const customerRepository = new CustomerRepository(db);
		const customer = new Customer("123", "Customer 1");
		const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
		customer.changeAddress(address);
		await customerRepository.create(customer);

		customer.changeName("Customer 2");
		await customerRepository.update(customer);
		const createdCustomer = await db
			.select()
			.from(customers)
			.where(eq(customers.id, customer.id))
			.limit(1);

		expect(createdCustomer[0]).toStrictEqual({
			id: "123",
			name: customer.name,
			isActive: customer.isActive(),
			rewardPoints: customer.rewardPoints,
			street: address.street,
			number: address.number,
			zipCode: address.zip,
			city: address.city,
		});
	});

	it("should find a customer", async () => {
		const customerRepository = new CustomerRepository(db);
		const customer = new Customer("123", "Customer 1");
		const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
		customer.address = address;
		await customerRepository.create(customer);

		const customerResult = await customerRepository.findById(customer.id);

		expect(customer).toStrictEqual(customerResult);
	});

	it("should throw an error when customer is not found", async () => {
		const customerRepository = new CustomerRepository(db);

		expect(async () => {
			await customerRepository.findById("456ABC");
		}).toThrow("Customer not found");
	});

	it("should find all customers", async () => {
		const customerRepository = new CustomerRepository(db);
		const customer1 = new Customer("123", "Customer 1");
		const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
		customer1.address = address1;
		customer1.addRewardPoints(10);
		customer1.activate();

		const customer2 = new Customer("456", "Customer 2");
		const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
		customer2.address = address2;
		customer2.addRewardPoints(20);

		await customerRepository.create(customer1);
		await customerRepository.create(customer2);

		const customers = await customerRepository.findAll();

		expect(customers).toHaveLength(2);
		expect(customers).toStrictEqual([customer1, customer2]);
	});
});
