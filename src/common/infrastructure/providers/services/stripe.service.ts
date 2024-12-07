import { StripeResponseCard } from 'src/common/application/stripe-service/stripe-response-card.interface';
import { IStripeService } from 'src/common/application/stripe-service/stripe-service.interface';
import Stripe from 'stripe';

export class StripeService implements IStripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_TEST_KEY, {
      apiVersion: '2024-11-20.acacia',
    });
  }

  async PaymentIntent(amount: number, token: string, costumerId: string, idOrder: string): Promise<boolean> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'usd',
        customer: costumerId,
        payment_method: token,
        payment_method_types: ['card'],
        confirm: true,
        description: 'Payment',
        metadata: {
          idOrder: idOrder,
        },
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  async saveUser(userId: string, email: string): Promise<string> {
    try {
      const customer = await this.stripe.customers.create({
        email: email,
        metadata: {
          userId: userId,
        },
      });
      return customer.id;
    } catch (err) {}
  }

  async saveCard(userId: string, cardId: string): Promise<boolean> {
    try {
      await this.stripe.paymentMethods.attach(cardId, {
        customer: userId,
      });
      return true;
    } catch (err) {}
  }

  async getCards(customerId: string): Promise<StripeResponseCard[]> {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
      return paymentMethods.data.map(method => ({
        id: method.id,
        brand: method.card.brand,
        last4: method.card.last4,
        exp_month: method.card.exp_month,
        exp_year: method.card.exp_year,
      }));
    } catch (err) {}
  }

  async refundPayment(idOrder: string, costumerId: string): Promise<boolean> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.list({
        customer: costumerId,
        limit: 100,
      });
      const payment = paymentIntent.data.find(p => p.metadata.idOrder === idOrder);
      if (payment) {
        await this.stripe.refunds.create({
          payment_intent: payment.id,
        });
        return true;
      }
      return false;
    } catch (e) {}
  }
}
