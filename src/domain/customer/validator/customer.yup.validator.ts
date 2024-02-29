import type { ValidatorInterface } from "../../@shared/validator/validator.interface";
import { Customer } from "../entity/customer";
import * as yup from "yup";

export class CustomerYupValidator implements ValidatorInterface<Customer> {
	validate(entity: Customer): void {
		try {
			yup
				.object()
				.shape({
					id: yup.string().required("Id is required"),
					name: yup.string().required("Name is required"),
				})
				.validateSync(
					{
						id: entity.id,
						name: entity.name,
					},
					{ abortEarly: false },
				);
		} catch (errors) {
			const e = errors as yup.ValidationError;

			for (const error of e.inner) {
				entity.notification.addError({
					message: error.message,
					context: "customer",
				});
			}
		}
	}
}
