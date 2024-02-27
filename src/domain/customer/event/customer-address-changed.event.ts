import type { EventInterface } from "../../@shared/event/event.interface";
import type { Address } from "../value-object/address";

interface CustomerAddressChangeEventPayload {
	id: string;
	name: string;
	address: Address;
}

export class CustomerAddressChangedEvent
	implements EventInterface<CustomerAddressChangeEventPayload>
{
	dateTimeOccurred: Date;
	eventData: CustomerAddressChangeEventPayload;

	constructor(id: string, name: string, address: Address) {
		this.dateTimeOccurred = new Date();
		this.eventData = {
			id,
			name,
			address,
		};
	}
}
