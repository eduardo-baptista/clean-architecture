import type { Customer } from "../../../domain/customer/entity/customer";
import type { CustomerRepositoryInterface } from "../../../domain/customer/repository/customer-repository.interface";
import type {
	InputListCustomerDto,
	OutputListCustomerDto,
} from "./list.customer.dto";

export default class ListCustomerUseCase {
	constructor(
		private readonly customerRepository: CustomerRepositoryInterface,
	) {}

	async execute(input: InputListCustomerDto): Promise<OutputListCustomerDto> {
		const customers = await this.customerRepository.findAll();

		return OutputMapper.toOutput(customers);
	}
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class OutputMapper {
	static toOutput(customer: Customer[]): OutputListCustomerDto {
		return {
			customers: customer.map((customer) => ({
				id: customer.id,
				name: customer.name,
				address: {
					street: customer.address.street,
					number: customer.address.number,
					zip: customer.address.zip,
					city: customer.address.city,
				},
			})),
		};
	}
}
