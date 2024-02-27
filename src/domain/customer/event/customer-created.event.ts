import type { EventInterface } from "../../@shared/event/event.interface";

interface CustomerCreateEventPayload {
	id: string;
	name: string;
}

export class CustomerCreateEvent
	implements EventInterface<CustomerCreateEventPayload>
{
	dateTimeOccurred: Date;
	eventData: CustomerCreateEventPayload;

	constructor(id: string, name: string) {
		this.dateTimeOccurred = new Date();
		this.eventData = { id, name };
	}
}
