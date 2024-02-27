import { eq } from "drizzle-orm";
import { Customer } from "../../../../domain/customer/entity/customer";
import type { CustomerRepositoryInterface } from "../../../../domain/customer/repository/customer-repository.interface";
import type { Drizzle } from "../../../db/drizzle/db";
import { customers } from "../../../db/drizzle/schema";
import { Address } from "../../../../domain/customer/value-object/address";

export class CustomerRepository implements CustomerRepositoryInterface {
	constructor(private db: Drizzle) {}

	async create(entity: Customer): Promise<void> {
		await this.db.insert(customers).values({
			id: entity.id,
			name: entity.name,
			isActive: entity.isActive(),
			rewardPoints: entity.rewardPoints,
			city: entity.address.city,
			number: entity.address.number,
			street: entity.address.street,
			zipCode: entity.address.zip,
		});
	}

	async update(entity: Customer): Promise<void> {
		await this.db
			.update(customers)
			.set({
				city: entity.address.city,
				number: entity.address.number,
				isActive: entity.isActive(),
				name: entity.name,
				rewardPoints: entity.rewardPoints,
				street: entity.address.street,
				zipCode: entity.address.zip,
			})
			.where(eq(customers.id, entity.id));
	}

	async findById(id: string): Promise<Customer> {
		const response = await this.db
			.select()
			.from(customers)
			.where(eq(customers.id, id))
			.limit(1);

		if (response.length === 0) {
			throw new Error("Customer not found");
		}

		const [dbCustomer] = response;
		const customer = new Customer(dbCustomer.id, dbCustomer.name);
		customer.address = new Address(
			dbCustomer.street,
			dbCustomer.number,
			dbCustomer.zipCode,
			dbCustomer.city,
		);
		if (dbCustomer.isActive) {
			customer.activate();
		}
		customer.addRewardPoints(dbCustomer.rewardPoints);

		return customer;
	}

	async findAll(): Promise<Customer[]> {
		const dbCustomers = await this.db.select().from(customers);

		return dbCustomers.map((dbCustomer) => {
			const customer = new Customer(dbCustomer.id, dbCustomer.name);
			customer.address = new Address(
				dbCustomer.street,
				dbCustomer.number,
				dbCustomer.zipCode,
				dbCustomer.city,
			);
			if (dbCustomer.isActive) {
				customer.activate();
			}
			customer.addRewardPoints(dbCustomer.rewardPoints);

			return customer;
		});
	}
}
