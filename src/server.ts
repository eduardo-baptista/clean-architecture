import { setupApp } from "./infrastructure/api/express";

const port = Number(process.env.PORT) || 3000;

const app = await setupApp();

app.engine.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
