// api/create-verification-session.js

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: {
        user_id: '{{USER_ID}}', // Replace with actual user ID if available
      },
      // You can add additional options here
    });

    res.status(200).json({
      client_secret: verificationSession.client_secret,
      url: verificationSession.url,
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: { message: e.message } });
  }
}
