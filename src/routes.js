import { Router } from 'express';
import userController from './app/controllers/UserController';

const routes = new Router();

routes.post('/user', userController.store);

export default routes;
