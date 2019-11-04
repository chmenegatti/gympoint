import HelpOrders from '../models/HelpOrders';
import Students from '../models/Students';
import Queue from '../../lib/Queue';
import AnswerMail from '../jobs/AnswerMail';

class AnswerHelpController {
  async index(req, res) {
    const noAnswers = await HelpOrders.findAll({
      where: { answer_at: null },
      order: ['created_at'],
      attributes: ['id', 'question', 'created_at'],
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });
    return res.status(200).json(noAnswers);
  }

  async update(req, res) {
    const helpId = req.params.id;

    const help = await HelpOrders.findByPk(helpId, {
      include: [
        {
          model: Students,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    const { answer, answer_at } = await help.update(req.body);

    await Queue.add(AnswerMail.key, { help });

    return res.status(200).json({
      question: help.question,
      answer,
      answer_at,
      student: {
        name: help.student.name,
        email: help.student.email,
      },
    });
  }
}

export default new AnswerHelpController();
