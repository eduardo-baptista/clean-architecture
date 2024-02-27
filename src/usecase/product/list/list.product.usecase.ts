import type { Product } from "../../../domain/product/entity/product";
import type { ProductRepositoryInterface } from "../../../domain/product/repository/product-repository.interface";
import type {
	InputListProductDto,
	OutputListProductDto,
} from "./list.product.dto";

export class ListProductUseCase {
	constructor(private readonly repository: ProductRepositoryInterface) {}

	async execute(input: InputListProductDto): Promise<OutputListProductDto> {
		const products = await this.repository.findAll();
		return OutputMapper.toOutput(products);
	}
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class OutputMapper {
	static toOutput(products: Product[]): OutputListProductDto {
		return {
			products: products.map((product) => ({
				id: product.id,
				name: product.name,
				price: product.price,
			})),
		};
	}
}
