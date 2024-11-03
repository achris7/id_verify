// api/create-verification-session.js

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      // You can customize the session parameters here
    });

    res.status(200).json({
      client_secret: verificationSession.client_secret,
      url: verificationSession.url,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
