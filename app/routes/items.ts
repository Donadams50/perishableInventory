import { Router } from "express";
const itemRouter = Router();

import * as validator from "../validators/validator";
 const {expressValidator, postItemValidator, sellItemValidator} = validator

import * as items from "../controllers/items";

itemRouter.post("/:name/add", postItemValidator(), expressValidator, items.addNewItem);
itemRouter.post("/:name/sell", sellItemValidator(), expressValidator, items.selltem);
itemRouter.get("/:name/quantity", items.getItems);

export default itemRouter;
