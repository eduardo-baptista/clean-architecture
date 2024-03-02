import type { ValidatorInterface } from "../../@shared/validator/validator.interface";
import type { Product } from "../entity/product";
import * as yup from "yup";

export class ProductYupValidator implements ValidatorInterface<Product> {
	validate(entity: Product): void {
		try {
			yup
				.object()
				.shape({
					id: yup.string().required("Id is required"),
					name: yup.string().required("Name is required"),
					price: yup
						.number()
						.min(0, "Price must be greater than zero")
						.required("Price is required"),
				})
				.validateSync(
					{
						id: entity.id,
						name: entity.name,
						price: entity.price,
					},
					{ abortEarly: false },
				);
		} catch (error) {
			const e = error as yup.ValidationError;

			for (const error of e.inner) {
				entity.notification.addError({
					message: error.message,
					context: "product",
				});
			}
		}
	}
}
