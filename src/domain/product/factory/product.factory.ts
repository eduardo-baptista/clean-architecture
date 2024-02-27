import { Product } from "../entity/product";
import { ProductB } from "../entity/product-b";
import type { ProductInterface } from "../entity/product.interface";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ProductFactory {
	public static create(
		type: string,
		name: string,
		price: number,
	): ProductInterface {
		switch (type) {
			case "a":
				return new Product(crypto.randomUUID(), name, price);
			case "b":
				return new ProductB(crypto.randomUUID(), name, price);
			default:
				throw new Error("Invalid product type");
		}
	}
}
