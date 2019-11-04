import { format, parseISO } from 'date-fns';
import ptbr from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { help } = data;

    await Mail.sendMail({
      to: `${help.student.name} <${help.student.email}>`,
      subject: 'Pergunta Respondida',
      template: 'answer',
      context: {
        student: help.student.name,
        question: help.question,
        answer: help.answer,
        answer_at: format(
          parseISO(help.answer_at),
          "dd'/'MMMM'/'yyyy', às' H:mm'h'",
          {
            locale: ptbr,
          }
        ),
      },
    });
  }
}

export default new SubscriptionMail();
