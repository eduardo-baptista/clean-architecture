import express, { type Request, type Response } from "express";
import { ProductRepository } from "../../product/repository/drizzle/product.repository";
import { ListProductUseCase } from "../../../usecase/product/list/list.product.usecase";

export const productRouter = express.Router();

productRouter.get("/product", async (req: Request, res: Response) => {
	const productRepository = new ProductRepository(req.db);
	const useCase = new ListProductUseCase(productRepository);

	try {
		const output = await useCase.execute({});
		res.status(200).json(output);
	} catch (err) {
		res.status(500).json(err);
	}
});
