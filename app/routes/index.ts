import { Router } from 'express';
import itemRouter from './items';

const routes = Router();

routes.use('/', itemRouter);

export default routes;