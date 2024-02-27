import type { EventInterface } from "./event.interface";

export interface EventHandlerInterface<T> {
	handle(event: T): void;
}
