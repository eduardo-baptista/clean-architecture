import { describe, it, expect } from "bun:test";
import { OrderItem } from "../entity/order_item";
import { Order } from "../entity/order";
import { OrderService } from "./order.service";
import { Customer } from "../../customer/entity/customer";

describe("Order service unit test", () => {
	it("should place an order", () => {
		const customer = new Customer("c1", "Customer 1");
		const item1 = new OrderItem("i1", "p1", "item 1", 10, 1);

		const order = OrderService.placeOrder(customer, [item1]);

		expect(customer.rewardPoints).toBe(5);
		expect(order.total()).toBe(10);
	});

	it("should get total of all orders", () => {
		const item1 = new OrderItem("i1", "Product 1", "item 1", 100, 1);
		const item2 = new OrderItem("i2", "Product 2", "item 2", 200, 2);

		const order1 = new Order("1", "c1", [item1]);
		const order2 = new Order("2", "c1", [item2]);

		const total = OrderService.total([order1, order2]);

		expect(total).toBe(500);
	});
});
