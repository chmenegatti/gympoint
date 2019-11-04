import { Router } from 'express';
import userController from './app/controllers/UserController';
import studentsController from './app/controllers/StudentsController';
import sessionConstroller from './app/controllers/SessionController';
import plansController from './app/controllers/PlansController';
import subscriptionController from './app/controllers/SubscriptionController';
import checkinController from './app/controllers/CheckinController';
import helpOrdersController from './app/controllers/HelpOrdersController';
import answerHelpController from './app/controllers/AnswerHelpController';
import authMiddleware from './app/middleware/auth';

const routes = new Router();

routes.post('/user', userController.store);
routes.post('/session', sessionConstroller.store);
routes.get('/students/:id/checkins', checkinController.index);
routes.post('/students/:id/checkins', checkinController.store);
routes.get('/students/:id/help-orders', helpOrdersController.index);
routes.post('/students/:id/help-orders', helpOrdersController.store);

routes.use(authMiddleware);
routes.post('/students', studentsController.store);
routes.put('/students/:id', studentsController.update);

/**
 * Plans Manager
 */
routes.get('/plans', plansController.index);
routes.post('/plans', plansController.store);
routes.put('/plans/:id', plansController.update);
routes.delete('/plans/:id', plansController.delete);

/**
 * Subscription Manager
 */
routes.get('/subscription', subscriptionController.index);
routes.post('/subscription', subscriptionController.store);
routes.put('/subscription/:id', subscriptionController.update);
routes.delete('/subscription/:id', subscriptionController.delete);

/**
 * Helping Orders Manager
 */

routes.get('/help-orders', answerHelpController.index);
routes.put('/help-orders/:id/answer', answerHelpController.update);
export default routes;
