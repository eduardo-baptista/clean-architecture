import { Product } from "../../../domain/product/entity/product";
import type { ProductRepositoryInterface } from "../../../domain/product/repository/product-repository.interface";
import type {
	InputCreateProductDto,
	OutputCreateProductDto,
} from "./create.product.dto";

export class CreateProductUseCase {
	constructor(private readonly productRepository: ProductRepositoryInterface) {}

	async execute(input: InputCreateProductDto): Promise<OutputCreateProductDto> {
		const product = new Product(crypto.randomUUID(), input.name, input.price);
		await this.productRepository.create(product);
		return {
			id: product.id,
			name: product.name,
			price: product.price,
		};
	}
}
