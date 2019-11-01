import { Router } from 'express';
import userController from './app/controllers/UserController';
import studentsController from './app/controllers/StudentsController';
import sessionConstroller from './app/controllers/SessionController';
import plansController from './app/controllers/PlansController';
import authMiddleware from './app/middleware/auth';

const routes = new Router();

routes.post('/user', userController.store);
routes.post('/session', sessionConstroller.store);

routes.use(authMiddleware);
routes.post('/students', studentsController.store);
routes.put('/students/:id', studentsController.update);

/**
 * Gestão dos planos
 */
routes.get('/plans', plansController.index);
routes.post('/plans', plansController.store);
routes.put('/plans/:id', plansController.update);
routes.delete('/plans/:id', plansController.delete);

export default routes;
