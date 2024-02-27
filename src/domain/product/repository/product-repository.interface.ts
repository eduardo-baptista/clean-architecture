import type { Product } from "../entity/product";
import type { RepositoryInterface } from "../../@shared/repository/repository.interface";

export interface ProductRepositoryInterface
	extends RepositoryInterface<Product> {}
