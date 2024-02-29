import type { ValidatorInterface } from "../../@shared/validator/validator.interface";
import type { Customer } from "../entity/customer";
import { CustomerYupValidator } from "../validator/customer.yup.validator";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CustomerValidatorFactory {
	static create(): ValidatorInterface<Customer> {
		return new CustomerYupValidator();
	}
}
