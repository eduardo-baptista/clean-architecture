import { eq, or } from "drizzle-orm";
import { Order } from "../../../../domain/checkout/entity/order";
import type { OrderRepositoryInterface } from "../../../../domain/checkout/repository/order-repository.interface";
import type { Drizzle } from "../../../db/drizzle/db";
import { orderItems, orders } from "../../../db/drizzle/schema";
import { OrderItem } from "../../../../domain/checkout/entity/order_item";

export class OrderRepository implements OrderRepositoryInterface {
	constructor(private db: Drizzle) {}

	async create(entity: Order): Promise<void> {
		await this.db.transaction(async (tx) => {
			await tx.insert(orders).values({
				customerId: entity.customerId,
				id: entity.id,
				total: entity.total(),
			});

			await tx.insert(orderItems).values(
				entity.items.map((item) => ({
					id: item.id,
					name: item.name,
					orderId: entity.id,
					price: item.price,
					productId: item.productId,
					quantity: item.quantity,
				})),
			);
		});
	}
	async update(entity: Order): Promise<void> {
		await this.db.transaction(async (tx) => {
			await tx
				.update(orders)
				.set({
					total: entity.total(),
				})
				.where(eq(orders.id, entity.id));

			const upsertPromises = entity.items.map(async (item) => {
				await tx
					.insert(orderItems)
					.values({
						id: item.id,
						name: item.name,
						orderId: entity.id,
						price: item.price,
						productId: item.productId,
						quantity: item.quantity,
					})
					.onConflictDoUpdate({
						target: orderItems.id,
						set: {
							name: item.name,
							price: item.price,
							quantity: item.quantity,
						},
					});
			});
			await Promise.all(upsertPromises);
		});
	}
	async findById(id: string): Promise<Order> {
		const result = await this.db.query.orders.findMany({
			where: eq(orders.id, id),
			with: { items: true },
			limit: 1,
		});

		if (result.length === 0) {
			throw new Error("Order not found");
		}

		const [dbOrder] = result;
		const order = new Order(
			dbOrder.id,
			dbOrder.customerId,
			dbOrder.items.map(
				(item) =>
					new OrderItem(
						item.id,
						item.productId,
						item.name,
						item.price,
						item.quantity,
					),
			),
		);

		return order;
	}

	async findAll(): Promise<Order[]> {
		const dbOrders = await this.db.query.orders.findMany({
			with: { items: true },
		});

		return dbOrders.map((dbOrder) => {
			return new Order(
				dbOrder.id,
				dbOrder.customerId,
				dbOrder.items.map(
					(item) =>
						new OrderItem(
							item.id,
							item.productId,
							item.name,
							item.price,
							item.quantity,
						),
				),
			);
		});
	}
}
