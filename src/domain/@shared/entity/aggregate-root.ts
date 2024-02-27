import type { EventInterface } from "../event/event.interface";

export abstract class AggregateRoot {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	events: Set<EventInterface<any>> = new Set();

	addEvent<T>(event: EventInterface<T>) {
		this.events.add(event);
	}

	clearEvents() {
		this.events.clear();
	}
}
