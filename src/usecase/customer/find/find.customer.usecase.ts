import type { CustomerRepositoryInterface } from "../../../domain/customer/repository/customer-repository.interface";
import type {
	InputFindCustomerDto,
	OutputFindCustomerDto,
} from "./find.customer.dto";

export class FindCustomerUseCase {
	private customerRepository: CustomerRepositoryInterface;

	constructor(customerRepository: CustomerRepositoryInterface) {
		this.customerRepository = customerRepository;
	}

	async execute(input: InputFindCustomerDto): Promise<OutputFindCustomerDto> {
		const customer = await this.customerRepository.findById(input.id);

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
	}
}
