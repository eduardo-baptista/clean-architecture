import type { ValidatorInterface } from "../../@shared/validator/validator.interface";
import type { Product } from "../entity/product";
import { ProductYupValidator } from "../validator/product.yup.validator";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ProductValidatorFactory {
	static create(): ValidatorInterface<Product> {
		return new ProductYupValidator();
	}
}
