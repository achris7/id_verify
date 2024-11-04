// api/webhook.js

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to verify Stripe signature
  },
};

export default async function handler(req, res) {
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'identity.verification_session.verified':
      // Handle successful verification
      break;
    case 'identity.verification_session.requires_input':
      // Handle failed verification
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
}

// Helper function to read the raw body
import { Readable } from 'stream';

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of Readable.from(readable)) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}
