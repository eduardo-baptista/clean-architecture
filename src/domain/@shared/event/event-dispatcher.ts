import type { AggregateRoot } from "../entity/aggregate-root";
import type { EventDispatcherInterface } from "./event-dispatcher.interface";
import type { EventHandlerInterface } from "./event-handler.interface";
import type { EventInterface } from "./event.interface";

export class EventDispatcher implements EventDispatcherInterface {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	private eventHandlers: Map<string, EventHandlerInterface<any>[]> = new Map();

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	getEventHandlers(eventName: string): EventHandlerInterface<any>[] {
		return this.eventHandlers.get(eventName) || [];
	}

	notify(aggregate: AggregateRoot): void {
		for (const event of aggregate.events) {
			const eventName = event.constructor.name;
			const handlers = this.getEventHandlers(eventName);

			for (const handler of handlers) {
				handler.handle(event);
			}
		}
		aggregate.clearEvents();
	}

	register<T>(eventName: string, eventHandler: EventHandlerInterface<T>): void {
		const handlers = this.getEventHandlers(eventName);
		handlers.push(eventHandler);
		this.eventHandlers.set(eventName, handlers);
	}

	unregister<T>(
		eventName: string,
		eventHandler: EventHandlerInterface<T>,
	): void {
		const handlers = this.getEventHandlers(eventName);
		const index = handlers.indexOf(eventHandler);
		if (index > -1) {
			handlers.splice(index, 1);
		}
	}

	unregisterAll(): void {
		this.eventHandlers.clear();
	}
}
