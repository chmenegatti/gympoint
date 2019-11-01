import * as Yup from 'yup';
import Plans from '../models/Plans';

class PlansController {
  async index(req, res) {
    const listPlans = await Plans.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
      order: ['id'],
    });
    if (listPlans === null) {
      return res.status(401).json({ error: 'There are no plans' });
    }
    return res.status(200).json(listPlans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, title, duration, price } = await Plans.create(req.body);
    return res.json({ id, title, duration, price });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const planId = req.params.id;
    const plan = await Plans.findByPk(planId);

    const { title } = req.body;
    if (title !== plan.title) {
      const checkTitle = await Plans.findOne({
        where: { title },
      });
      if (checkTitle) {
        return res.status(401).json({ error: 'Title plan alredy exists' });
      }
    }
    const { id, duration, price } = await plan.update(req.body);

    return res.status(200).json({ id, title, duration, price });
  }

  async delete(req, res) {
    const planId = req.params.id;
    const plan = await Plans.findByPk(planId);
    if (!plan) {
      return res.status(401).json({ error: 'Not Found' });
    }
    await plan.destroy();
    return res.status(200).json({ message: 'Deleted' });
  }
}

export default new PlansController();
