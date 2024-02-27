import type { EventHandlerInterface } from "../../../@shared/event/event-handler.interface";
import type { EventInterface } from "../../../@shared/event/event.interface";
import type { ProductCreatedEvent } from "../product-created.event";

export class SendEmailWhenProductIsCreatedHandler
	implements EventHandlerInterface<ProductCreatedEvent>
{
	handle(event: ProductCreatedEvent): void {
		console.log(
			`Sending email to the user about the product: ${event.eventData.id}`,
		);
	}
}
