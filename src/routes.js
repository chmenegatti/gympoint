import { Router } from 'express';
import userController from './app/controllers/UserController';
import studentsController from './app/controllers/StudentsController';
import sessionConstroller from './app/controllers/SessionController';
import authMiddleware from './app/middleware/auth';

const routes = new Router();

routes.post('/user', userController.store);
routes.post('/session', sessionConstroller.store);

routes.use(authMiddleware);
routes.post('/students', studentsController.store);
routes.put('/students/:id', studentsController.update);

export default routes;
