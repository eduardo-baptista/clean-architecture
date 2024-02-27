import { relations } from "drizzle-orm";
import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	price: real("price").notNull(),
});

export const customers = sqliteTable("customers", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	street: text("street").notNull(),
	number: integer("number").notNull(),
	zipCode: text("zip_code").notNull(),
	city: text("city").notNull(),
	isActive: integer("is_active", { mode: "boolean" }).notNull(),
	rewardPoints: integer("reward_points").notNull(),
});

export const orders = sqliteTable("orders", {
	id: text("id").primaryKey().notNull(),
	customerId: text("customer_id").notNull(),
	total: real("total").notNull(),
});

export const orderItems = sqliteTable("order_items", {
	id: text("id").primaryKey().notNull(),
	productId: text("product_id").notNull(),
	orderId: text("order_id").notNull(),
	name: text("name").notNull(),
	quantity: integer("quantity").notNull(),
	price: real("price").notNull(),
});

export const orderItemsRelation = relations(orderItems, ({ one }) => ({
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id],
	}),
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id],
	}),
}));

export const ordersRelation = relations(orders, ({ one, many }) => ({
	customer: one(customers, {
		fields: [orders.customerId],
		references: [customers.id],
	}),
	items: many(orderItems),
}));
