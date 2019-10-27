import * as Yup from 'yup';
import Students from '../models/Students';

class StudentsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      birth_date: Yup.date().required(),
      weight: Yup.number()
        .positive()
        .required(),
      height: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentsExists = await Students.findOne({
      where: { email: req.body.email },
    });
    if (studentsExists) {
      return res.status(401).json({ error: 'Student already exists!' });
    }
    const {
      id,
      name,
      email,
      birth_date,
      weight,
      height,
    } = await Students.create(req.body);
    return res.json({
      id,
      name,
      email,
      birth_date,
      weight,
      height,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string()
        .email()
        .required(),
      birth_date: Yup.date(),
      weight: Yup.number().positive(),
      height: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const studentId = req.params.id;
    const student = await Students.findByPk(studentId);

    const { email } = req.body;
    if (email !== student.email) {
      const studentsExists = await Students.findOne({
        where: { email },
      });
      if (studentsExists) {
        return res.status(401).json({ error: 'Student already exists!' });
      }
    }

    const { id, name, birth_date, weight, height } = await student.update(
      req.body
    );
    return res.status(200).json({
      id,
      name,
      email,
      birth_date,
      weight,
      height,
    });
  }
}

export default new StudentsController();
