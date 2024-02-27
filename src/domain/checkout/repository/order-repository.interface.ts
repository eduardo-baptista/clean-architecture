import type { Order } from "../entity/order";
import type { RepositoryInterface } from "../../@shared/repository/repository.interface";

export interface OrderRepositoryInterface extends RepositoryInterface<Order> {}
