import { expect, describe, it, beforeEach, afterEach } from "bun:test";
import { setupApp } from "../express";
import request from "supertest";
import { type Express } from "express";
import { CustomerFactory } from "../../../domain/customer/factory/customer.factory";
import { Address } from "../../../domain/customer/value-object/address";
import type { Drizzle } from "../../db/drizzle/db";
import { CustomerRepository } from "../../customer/repository/drizzle/customer.repository";

describe("E2E test for customer", () => {
	let engine: Express;
	let db: Drizzle;

	beforeEach(async () => {
		const app = await setupApp();
		engine = app.engine;
		db = app.db;
	});

	it("should create a customer", async () => {
		const response = await request(engine)
			.post("/customer")
			.send({
				name: "Customer 1",
				address: {
					street: "Street 1",
					city: "City 1",
					number: 1,
					zip: "Zip 1",
				},
			});

		expect(response.status).toBe(201);
		expect(response.body).toStrictEqual({
			id: expect.any(String),
			name: "Customer 1",
			address: {
				street: "Street 1",
				city: "City 1",
				number: 1,
				zip: "Zip 1",
			},
		});
	});

	it("should not create a customer", async () => {
		const response = await request(engine)
			.post("/customer")
			.send({ name: "Customer 1" });

		expect(response.status).toBe(500);
	});

	it("should list all customers", async () => {
		const customer1 = CustomerFactory.createWithAddress(
			"Customer 1",
			new Address("Street 1", 1, "Zip 1", "City 1"),
		);
		const customer2 = CustomerFactory.createWithAddress(
			"Customer 2",
			new Address("Street 2", 2, "Zip 2", "City 2"),
		);
		const customerRepository = new CustomerRepository(db);
		await Promise.all([
			customerRepository.create(customer1),
			customerRepository.create(customer2),
		]);

		const response = await request(engine).get("/customer").send();

		expect(response.status).toBe(200);
		expect(response.body.customers).toHaveLength(2);

		expect(response.body.customers[0].id).toBe(customer1.id);
		expect(response.body.customers[1].id).toBe(customer2.id);

		const responseXML = await request(engine)
			.get("/customer")
			.set("Accept", "application/xml")
			.send();

		expect(responseXML.status).toBe(200);
		expect(responseXML.text).toContain(
			'<?xml version="1.0" encoding="UTF-8"?>',
		);
	});
});
