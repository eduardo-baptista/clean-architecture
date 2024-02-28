import express, { type Request, type Response } from "express";
import { CreateCustomerUseCase } from "../../../usecase/customer/create/create.customer.usecase";
import { CustomerRepository } from "../../customer/repository/drizzle/customer.repository";
import ListCustomerUseCase from "../../../usecase/customer/list/list.customer.usecase";

export const customerRouter = express.Router();

customerRouter.post("/customer", async (req: Request, res: Response) => {
	const customerRepository = new CustomerRepository(req.db);
	const useCase = new CreateCustomerUseCase(customerRepository);
	console.log(req.body);
	try {
		const output = await useCase.execute({
			name: req.body.name,
			address: {
				city: req.body.address.city,
				number: req.body.address.number,
				street: req.body.address.street,
				zip: req.body.address.zip,
			},
		});
		res.status(201).json(output);
	} catch (err) {
		res.status(500).json(err);
	}
});

customerRouter.get("/customer", async (req: Request, res: Response) => {
	const customerRepository = new CustomerRepository(req.db);
	const useCase = new ListCustomerUseCase(customerRepository);

	try {
		const customers = await useCase.execute({});
		res.status(200).json(customers);
	} catch (err) {
		res.status(500).json(err);
	}
});
