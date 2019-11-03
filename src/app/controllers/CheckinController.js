import { startOfWeek, endOfWeek, format } from 'date-fns';
import Checkins from '../schema/Checkin';

class CheckinController {
  async index(req, res) {
    const student_id = req.params.id;
    const { page = 1 } = req.query;
    const checkins = await Checkins.find({ student_id })
      .skip(5 * page)
      .limit(5);
    return res.status(200).json(checkins);
  }

  async store(req, res) {
    const student_id = req.params.id;
    const checkins = await Checkins.find({ student_id });

    const today = new Date();
    const formattedToday = format(today, 'dd/MM/yyyy');

    const checkedToday = checkins.filter(itens => {
      return format(itens.createdAt, 'dd/MM/yyyy') === formattedToday;
    });
    if (checkedToday.length === 1) {
      return res
        .status(401)
        .json({ error: 'You already have checked-in today' });
    }

    const weekBegin = startOfWeek(today);
    const weekEnd = endOfWeek(today);

    const numCheckins = checkins.filter(itens => {
      const data = itens.createdAt >= weekBegin && itens.createdAt <= weekEnd;
      return data;
    });

    if (!(numCheckins.length <= 5)) {
      return res.status(401).json({ error: 'Max checkins has reached' });
    }
    const checkin = await Checkins.create({
      student_id,
    });

    return res.status(200).json(checkin);
  }
}

export default new CheckinController();
