import express, { Application, Request, Response } from "express";
import routes from "./app/routes";

const app: Application = express();
const port = 8000;

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

import { sequelize } from "./app/sequelize";
sequelize.sync();

app.get("/", async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: "Welcome to Perishable Inventory by Adam!",
  });
});

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error) {
  console.error(`Error occured: ${error}`);
}
 