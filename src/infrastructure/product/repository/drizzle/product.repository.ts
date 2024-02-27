import { eq } from "drizzle-orm";
import { Product } from "../../../../domain/product/entity/product";
import type { ProductRepositoryInterface } from "../../../../domain/product/repository/product-repository.interface";
import type { Drizzle } from "../../../db/drizzle/db";
import { products } from "../../../db/drizzle/schema";

export class ProductRepository implements ProductRepositoryInterface {
	constructor(private readonly db: Drizzle) {}

	async create(entity: Product): Promise<void> {
		await this.db.insert(products).values({
			id: entity.id,
			name: entity.name,
			price: entity.price,
		});
	}

	async update(entity: Product): Promise<void> {
		await this.db
			.update(products)
			.set({ name: entity.name, price: entity.price })
			.where(eq(products.id, entity.id));
	}

	async findById(id: string): Promise<Product> {
		const response = await this.db
			.select()
			.from(products)
			.where(eq(products.id, id))
			.limit(1);

		if (response.length === 0) {
			throw new Error("Product not found");
		}
		const [productDb] = response;
		return new Product(productDb.id, productDb.name, productDb.price);
	}

	async findAll(): Promise<Product[]> {
		const result = await this.db.select().from(products);
		return result.map((row) => new Product(row.id, row.name, row.price));
	}
}
