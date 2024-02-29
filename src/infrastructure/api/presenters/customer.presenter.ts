import { toXML } from "jstoxml";
import type { OutputListCustomerDto } from "../../../usecase/customer/list/list.customer.dto";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CustomerPresenter {
	static listXML(data: OutputListCustomerDto): string {
		const xmlOptions = {
			header: true,
			indent: "  ",
			newline: "\n",
			allowEmpty: true,
		};

		return toXML(
			{
				customers: {
					customer: data.customers.map((customer) => {
						return {
							id: customer.id,
							name: customer.name,
							address: {
								street: customer.address.street,
								number: customer.address.number,
								zip: customer.address.zip,
								city: customer.address.city,
							},
						};
					}),
				},
			},
			xmlOptions,
		);
	}
}
