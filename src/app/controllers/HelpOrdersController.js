import * as Yup from 'yup';
import HelpOrders from '../models/HelpOrders';

class HelpOrderController {
  async index(req, res) {
    const student_id = req.params.id;
    const helpOrder = await HelpOrders.findAll({
      where: { student_id },
      attributes: ['id', 'question', 'answer', 'answer_at'],
    });
    return res.status(200).json(helpOrder);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Fails' });
    }
    const student_id = req.params.id;
    const { id, question } = req.body;
    await HelpOrders.create({ id, student_id, question });
    return res.status(200).json({ student_id, question });
  }
}

export default new HelpOrderController();
