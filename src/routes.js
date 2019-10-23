import { Router } from 'express';
import userController from './app/controllers/UserController';
import sessionConstroller from './app/controllers/SessionController';
import authMiddleware from './app/middleware/auth';

const routes = new Router();

routes.post('/user', userController.store);
routes.post('/session', sessionConstroller.store);

routes.use(authMiddleware);
routes.put('/user', userController.upadate);

export default routes;
