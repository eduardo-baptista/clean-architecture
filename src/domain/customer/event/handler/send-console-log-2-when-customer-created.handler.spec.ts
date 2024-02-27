import { describe, expect, it, spyOn } from "bun:test";
import { Customer } from "../../entity/customer";
import { EventDispatcher } from "../../../@shared/event/event-dispatcher";
import { SendConsoleLog2WhenCustomerCreatedHandler } from "./send-console-log-2-when-customer-created.handler";

describe("Send Console Log 2 When Customer Created unit tests", () => {
	it("should send console log 2 when customer created", () => {
		const dispatcher = new EventDispatcher();
		const handler = new SendConsoleLog2WhenCustomerCreatedHandler();

		const handlerSpy = spyOn(handler, "handle");

		dispatcher.register("CustomerCreateEvent", handler);
		const customer = Customer.create("1", "John Doe");

		dispatcher.notify(customer);

		expect(handlerSpy).toHaveBeenCalledWith({
			eventData: {
				id: "1",
				name: "John Doe",
			},
			dateTimeOccurred: expect.any(Date),
		});
	});
});
