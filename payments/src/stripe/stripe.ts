// Stripe is a liberary for handle payments.
// NOTICE: Stripe is not support in Israel - so we cant use it in real app
// But, for tesing mode stripe give us a default successful token that we can use - "tok_visa"
import Stripe from 'stripe';

export const stripeConnection = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2022-11-15',
});
