import express, { type Request, type Response } from "express";
import { CreateCustomerUseCase } from "../../../usecase/customer/create/create.customer.usecase";
import { CustomerRepository } from "../../customer/repository/drizzle/customer.repository";
import ListCustomerUseCase from "../../../usecase/customer/list/list.customer.usecase";
import { CustomerPresenter } from "../presenters/customer.presenter";

export const customerRouter = express.Router();

customerRouter.post("/customer", async (req: Request, res: Response) => {
	const customerRepository = new CustomerRepository(req.db);
	const useCase = new CreateCustomerUseCase(customerRepository);

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
		const output = await useCase.execute({});
		res.format({
			json: () => res.send(output),
			xml: () => res.send(CustomerPresenter.listXML(output)),
		});
	} catch (err) {
		res.status(500).json(err);
	}
});
