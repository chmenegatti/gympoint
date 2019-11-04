import { format, parseISO } from 'date-fns';
import ptbr from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { addSubscription, allData } = data;

    await Mail.sendMail({
      to: `${allData.name} <${allData.email}>`,
      subject: 'Aluno Matriculado',
      template: 'subscription',
      context: {
        student: allData.name,
        title: allData.title,
        date_start: format(parseISO(addSubscription.start_date), 'dd/MM/yyyy', {
          locale: ptbr,
        }),
        date_end: format(parseISO(addSubscription.end_date), 'dd/MM/yyyy', {
          locale: ptbr,
        }),
        price: allData.price,
        total_price: addSubscription.plan_price,
      },
    });
  }
}

export default new SubscriptionMail();
