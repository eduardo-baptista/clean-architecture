import type { EventHandlerInterface } from "../../../@shared/event/event-handler.interface";
import type { CustomerAddressChangedEvent } from "../customer-address-changed.event";

export class SendConsoleLogWhenCustomerAddressChangedHandler
	implements EventHandlerInterface<CustomerAddressChangedEvent>
{
	async handle(event: CustomerAddressChangedEvent): Promise<void> {
		console.log(
			`Endereço do cliente: ${event.eventData.id}, ${
				event.eventData.name
			} alterado para: ${event.eventData.address.toString()}`,
		);
	}
}
