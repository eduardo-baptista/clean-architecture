import { describe, expect, it } from "bun:test";
import { Order } from "./order";
import { OrderItem } from "./order_item";

describe("Order unit tests", () => {
	it("should throw error when id is empty", () => {
		expect(() => new Order("", "123", [])).toThrow("Id is required");
	});

	it("should throw error when customer id is empty", () => {
		expect(() => new Order("123", "", [])).toThrow("Customer Id is required");
	});

	it("should throw error when items is empty", () => {
		expect(() => new Order("123", "123", [])).toThrow(
			"Items qtd must be greater than 0",
		);
	});

	it("should calculate total", () => {
		const item = new OrderItem("1", "p1", "Item 1", 100, 2);
		const order = new Order("1", "123", [item]);

		expect(order.total()).toBe(200);

		const item2 = new OrderItem("2", "p2", "Item 2", 200, 2);
		const order2 = new Order("2", "123", [item, item2]);

		expect(order2.total()).toBe(600);
	});

	it("should throw error if the item qtd is less than 1", () => {
		expect(() => {
			const item = new OrderItem("1", "p1", "Item 1", 100, 0);
			const order = new Order("1", "123", [item]);
		}).toThrow("Item quantity must be greater than 0");
	});
});
