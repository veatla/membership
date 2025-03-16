import stripeLib from 'stripe';
import ENV from '../environment';

const stripe = new stripeLib(ENV.STRIPE_SECRET_KEY);

export default stripe;
