import { parseISO, addMonths, format } from 'date-fns';
import ptbr from 'date-fns/locale/pt-BR';
import * as Yup from 'yup';
import Subscription from '../models/Subscription';
import Plans from '../models/Plans';
import Students from '../models/Students';
import Mail from '../../lib/Mail';

class SubscriptionController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const subscriptions = await Subscription.findAll({
      order: ['createdAt'],
      attributes: ['id', 'start_date', 'end_date', 'plan_price'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Plans,
          as: 'plan',
          attributes: ['title'],
        },
        {
          model: Students,
          as: 'student',
          attributes: ['name', 'birth_date', 'email', 'height', 'weight'],
        },
      ],
    });

    return res.json(subscriptions);
  }

  async store(req, res) {
    const today = new Date();
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .positive()
        .required(),
      plan_id: Yup.number()
        .positive()
        .required(),
      start_date: Yup.date()
        .min(today)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation Fails' });
    }
    const { student_id, plan_id, start_date } = req.body;

    /**
     * Check is stutend exists
     */
    const student = await Students.findByPk(student_id);
    if (!student) {
      return res.status(401).json({ error: 'Student does not exists' });
    }

    /**
     * Get plans details
     */
    const { title, duration, price } = await Plans.findByPk(plan_id);

    /**
     * Claculate end date and plan price by plan choice
     */
    const end_date = addMonths(parseISO(start_date), duration);
    const plan_price = price * duration;

    const addSubscription = await Subscription.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      plan_price,
    });
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Aluno Matriculado',
      template: 'subscription',
      context: {
        student: student.name,
        title,
        date_start: format(parseISO(start_date), 'dd/MM/yyyy', {
          locale: ptbr,
        }),
        date_end: format(end_date, 'dd/MM/yyyy', { locale: ptbr }),
        price,
        total_price: plan_price,
      },
    });
    return res.json(addSubscription);
  }

  async update(req, res) {
    const today = new Date();

    const schema = Yup.object().shape({
      student_id: Yup.number()
        .positive()
        .required(),
      plan_id: Yup.number()
        .positive()
        .required(),
      start_date: Yup.date()
        .min(today)
        .label('Data menor que hoje.')
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation Fails' });
    }

    const subscriptionId = req.params.id;

    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      return res.status(401).json({ error: 'Subscription not found' });
    }
    const { plan_id, start_date } = req.body;

    /**
     * Get plans details
     */
    const { duration, price } = await Plans.findByPk(plan_id);

    /**
     * Claculate end date and plan price by plan choice
     */
    const end_date = addMonths(parseISO(start_date), duration);
    const plan_price = price * duration;

    const { student_id } = await subscription.update({
      plan_id,
      start_date,
      end_date,
      plan_price,
    });

    return res.json({
      student_id,
      plan_id,
      start_date,
      end_date,
      plan_price,
    });
  }

  async delete(req, res) {
    const subscription_id = req.params.id;

    const subscription = await Subscription.findByPk(subscription_id);
    if (!subscription) {
      return res.status(401).json({ error: 'Subscription not found' });
    }
    await subscription.destroy();
    return res.json({ message: 'Deleted' });
  }
}
export default new SubscriptionController();
