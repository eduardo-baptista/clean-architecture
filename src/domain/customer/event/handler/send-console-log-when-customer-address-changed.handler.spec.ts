import { describe, expect, it, spyOn } from "bun:test";
import { EventDispatcher } from "../../../@shared/event/event-dispatcher";
import { SendConsoleLogWhenCustomerAddressChangedHandler } from "./send-console-log-when-customer-address-changed.handler";
import { Customer } from "../../entity/customer";
import { Address } from "../../value-object/address";

describe("Send Console Log When Customer Address Changed unit tests", () => {
	it("should send console log when customer address changed", () => {
		const dispatcher = new EventDispatcher();
		const handler = new SendConsoleLogWhenCustomerAddressChangedHandler();

		const handlerSpy = spyOn(handler, "handle");

		dispatcher.register("CustomerAddressChangedEvent", handler);

		const customer = new Customer("1", "John Doe");

		const address = new Address("Rua A", 1, "São Paulo", "SP");
		customer.changeAddress(address);

		dispatcher.notify(customer);

		expect(handlerSpy).toHaveBeenCalledWith({
			eventData: {
				id: "1",
				name: "John Doe",
				address: address,
			},
			dateTimeOccurred: expect.any(Date),
		});
	});
});
