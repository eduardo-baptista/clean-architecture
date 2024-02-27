import type { EventInterface } from "../../@shared/event/event.interface";

interface ProductCreatedEventData {
	id: string;
	name: string;
	price: number;
}

export class ProductCreatedEvent
	implements EventInterface<ProductCreatedEventData>
{
	dateTimeOccurred: Date;
	eventData: ProductCreatedEventData;

	constructor(productCreatedEventData: ProductCreatedEventData) {
		this.dateTimeOccurred = new Date();
		this.eventData = productCreatedEventData;
	}
}
