import { StripeResponseCard } from './stripe-response-card.interface';

export interface IStripeService {
  PaymentIntent(amount: number, currency: string, token: string): Promise<boolean>;
  saveUser(userId: string, email: string): Promise<string>;
  saveCard(userId: string, cardId: string): Promise<boolean>;
  getCards(userId: string): Promise<StripeResponseCard[]>;
}