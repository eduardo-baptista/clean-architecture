import { describe, expect, it, spyOn } from "bun:test";
import { EventDispatcher } from "./event-dispatcher";
import { SendEmailWhenProductIsCreatedHandler } from "../../product/event/handler/send-email-when-product-is-created.handler";
import { ProductCreatedEvent } from "../../product/event/product-created.event";
import { Product } from "../../product/entity/product";

describe("Domain events tests", () => {
	it("should register an event handler", () => {
		const eventDispatcher = new EventDispatcher();
		const EventHandler = new SendEmailWhenProductIsCreatedHandler();

		eventDispatcher.register("ProductCreatedEvent", EventHandler);

		expect(
			eventDispatcher.getEventHandlers("ProductCreatedEvent"),
		).toBeDefined();
		expect(
			eventDispatcher.getEventHandlers("ProductCreatedEvent"),
		).toHaveLength(1);
		expect(eventDispatcher.getEventHandlers("ProductCreatedEvent")).toContain(
			EventHandler,
		);
	});

	it("should unregister an event handler", () => {
		const eventDispatcher = new EventDispatcher();
		const EventHandler = new SendEmailWhenProductIsCreatedHandler();

		eventDispatcher.register("ProductCreatedEvent", EventHandler);

		expect(
			eventDispatcher.getEventHandlers("ProductCreatedEvent"),
		).toHaveLength(1);

		eventDispatcher.unregister("ProductCreatedEvent", EventHandler);

		expect(
			eventDispatcher.getEventHandlers("ProductCreatedEvent"),
		).toHaveLength(0);
	});

	it("should unregister all event handlers", () => {
		const eventDispatcher = new EventDispatcher();
		const EventHandler = new SendEmailWhenProductIsCreatedHandler();

		eventDispatcher.register("ProductCreatedEvent", EventHandler);

		expect(
			eventDispatcher.getEventHandlers("ProductCreatedEvent"),
		).toHaveLength(1);

		eventDispatcher.unregisterAll();

		expect(
			eventDispatcher.getEventHandlers("ProductCreatedEvent"),
		).toHaveLength(0);
	});

	it("should notify all event handlers", () => {
		const eventDispatcher = new EventDispatcher();
		const EventHandler = new SendEmailWhenProductIsCreatedHandler();
		const spyEventHandler = spyOn(EventHandler, "handle");

		eventDispatcher.register("ProductCreatedEvent", EventHandler);

		expect(
			eventDispatcher.getEventHandlers("ProductCreatedEvent"),
		).toHaveLength(1);

		const productCreatedEvent = new ProductCreatedEvent({
			id: "1",
			name: "Product",
			price: 100,
		});

		const product = new Product("1", "Product", 100);
		product.addEvent(productCreatedEvent);

		eventDispatcher.notify(product);

		expect(spyEventHandler).toHaveBeenCalled();
	});
});
