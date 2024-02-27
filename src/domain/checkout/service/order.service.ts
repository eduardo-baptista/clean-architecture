import type { Customer } from "../../customer/entity/customer";
import { Order } from "../entity/order";
import type { OrderItem } from "../entity/order_item";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class OrderService {
	static total(orders: Order[]): number {
		return orders.reduce((acc, order) => acc + order.total(), 0);
	}

	static placeOrder(customer: Customer, items: OrderItem[]): Order {
		const order = new Order(crypto.randomUUID(), customer.id, items);
		customer.addRewardPoints(order.total() / 2);
		return order;
	}
}
