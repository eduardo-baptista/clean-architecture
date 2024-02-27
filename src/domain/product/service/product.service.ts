import type { Product } from "../entity/product";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ProductService {
	public static increasePrice(products: Product[], percentage: number) {
		for (const product of products) {
			product.changePrice(product.price * (1 + percentage / 100));
		}
	}
}
