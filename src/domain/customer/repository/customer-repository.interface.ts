import type { Customer } from "../entity/customer";
import type { RepositoryInterface } from "../../@shared/repository/repository.interface";

export interface CustomerRepositoryInterface
	extends RepositoryInterface<Customer> {}
