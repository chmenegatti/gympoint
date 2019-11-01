import { parseISO, addMonths } from 'date-fns';
import Subscription from '../models/Subscription';
import Plans from '../models/Plans';
import Students from '../models/Students';

class SubscriptionController {
  async index(req, res) {
    return res.json({ ok: true });
  }

  async store(req, res) {
    const { student_id, plan_id, start_date } = req.body;

    /**
     * Check is stutend exists
     */
    const checkStudent = await Students.findByPk(student_id);
    if (!checkStudent) {
      return res.status(401).json({ error: 'Student does not exists' });
    }

    /**
     * Get plans details
     */
    const { duration, price } = await Plans.findByPk(plan_id);

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

    return res.json(addSubscription);
  }

  async update(req, res) {
    return res.json({ ok: true });
  }

  async delete(req, res) {
    return res.json({ ok: true });
  }
}
export default new SubscriptionController();
