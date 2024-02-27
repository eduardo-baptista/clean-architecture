import type { EventHandlerInterface } from "../../../@shared/event/event-handler.interface";
import type { CustomerCreateEvent } from "../customer-created.event";

export class SendConsoleLog2WhenCustomerCreatedHandler
	implements EventHandlerInterface<CustomerCreateEvent>
{
	handle(event: CustomerCreateEvent): void {
		console.log("Esse é o segundo console.log do evento: CustomerCreated");
	}
}
