import { Database } from "bun:sqlite";
import { expect, it, describe, beforeEach, afterEach } from "bun:test";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { databaseFactory, type Drizzle } from "../../../db/drizzle/db";
import { Customer } from "../../../../domain/customer/entity/customer";
import { Address } from "../../../../domain/customer/value-object/address";
import { customers, orders } from "../../../db/drizzle/schema";
import { eq } from "drizzle-orm";
import { CustomerRepository } from "../../../customer/repository/drizzle/customer.repository";
import { ProductRepository } from "../../../product/repository/drizzle/product.repository";
import { Product } from "../../../../domain/product/entity/product";
import { OrderItem } from "../../../../domain/checkout/entity/order_item";
import { Order } from "../../../../domain/checkout/entity/order";
import { OrderRepository } from "./order.repository";

describe("Order repository test", () => {
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

	it("should create a new order", async () => {
		const customer = new Customer("1", "name");
		const address = new Address("street", 123, "zip", "city");
		customer.changeAddress(address);
		const customerRepository = new CustomerRepository(db);
		await customerRepository.create(customer);

		const productRepository = new ProductRepository(db);
		const product = new Product("1", "product 1", 10);
		await productRepository.create(product);

		const orderItem = new OrderItem(
			"1",
			product.id,
			product.name,
			product.price,
			2,
		);
		const order = new Order("1", customer.id, [orderItem]);

		const orderRepository = new OrderRepository(db);
		await orderRepository.create(order);

		const createdOrder = await db.query.orders.findMany({
			where: eq(orders.id, order.id),
			with: { items: true },
		});

		expect(createdOrder[0]).toStrictEqual({
			id: order.id,
			customerId: order.customerId,
			items: [
				{
					id: orderItem.id,
					productId: orderItem.productId,
					name: orderItem.name,
					price: orderItem.price,
					quantity: orderItem.quantity,
					orderId: order.id,
				},
			],
			total: order.total(),
		});
	});

	it("should update an order", async () => {
		const customer = new Customer("1", "name");
		const address = new Address("street", 123, "zip", "city");
		customer.changeAddress(address);
		const customerRepository = new CustomerRepository(db);
		await customerRepository.create(customer);

		const productRepository = new ProductRepository(db);
		const product = new Product("1", "product 1", 10);
		await productRepository.create(product);

		const orderItem = new OrderItem(
			"1",
			product.id,
			product.name,
			product.price,
			2,
		);

		const order = new Order("1", customer.id, [orderItem]);

		const orderRepository = new OrderRepository(db);
		await orderRepository.create(order);

		const orderItem2 = new OrderItem(
			"2",
			product.id,
			product.name,
			product.price,
			3,
		);
		order.addItem(orderItem2);

		await orderRepository.update(order);

		const createdOrder = await db.query.orders.findMany({
			where: eq(orders.id, order.id),
			with: { items: true },
		});

		expect(createdOrder[0]).toStrictEqual({
			id: order.id,
			customerId: order.customerId,
			items: [
				{
					id: orderItem.id,
					productId: orderItem.productId,
					name: orderItem.name,
					price: orderItem.price,
					quantity: orderItem.quantity,
					orderId: order.id,
				},
				{
					id: orderItem2.id,
					productId: orderItem2.productId,
					name: orderItem2.name,
					price: orderItem2.price,
					quantity: orderItem2.quantity,
					orderId: order.id,
				},
			],
			total: order.total(),
		});
	});

	it("should find an order by id", async () => {
		const customer = new Customer("1", "name");
		const address = new Address("street", 123, "zip", "city");
		customer.changeAddress(address);
		const customerRepository = new CustomerRepository(db);
		await customerRepository.create(customer);

		const productRepository = new ProductRepository(db);
		const product = new Product("1", "product 1", 10);
		await productRepository.create(product);

		const orderItem = new OrderItem(
			"1",
			product.id,
			product.name,
			product.price,
			2,
		);
		const orderItem2 = new OrderItem(
			"2",
			product.id,
			product.name,
			product.price,
			3,
		);

		const order = new Order("1", customer.id, [orderItem, orderItem2]);
		const orderRepository = new OrderRepository(db);
		await orderRepository.create(order);

		const foundOrder = await orderRepository.findById(order.id);

		expect(foundOrder).toStrictEqual(order);
	});

	it("should throw error when order not found", async () => {
		const orderRepository = new OrderRepository(db);
		await expect(orderRepository.findById("1")).rejects.toThrow(
			"Order not found",
		);
	});

	it("should find all orders", async () => {
		const customer = new Customer("1", "name");
		const address = new Address("street", 123, "zip", "city");
		customer.changeAddress(address);
		const customerRepository = new CustomerRepository(db);
		await customerRepository.create(customer);

		const productRepository = new ProductRepository(db);
		const product = new Product("1", "product 1", 10);
		await productRepository.create(product);

		const orderItem = new OrderItem(
			"1",
			product.id,
			product.name,
			product.price,
			2,
		);
		const orderItem2 = new OrderItem(
			"2",
			product.id,
			product.name,
			product.price,
			3,
		);

		const order = new Order("1", customer.id, [orderItem]);
		const order2 = new Order("2", customer.id, [orderItem2]);

		const orderRepository = new OrderRepository(db);
		await orderRepository.create(order);
		await orderRepository.create(order2);

		const foundOrders = await orderRepository.findAll();

		expect(foundOrders).toStrictEqual([order, order2]);
	});
});
