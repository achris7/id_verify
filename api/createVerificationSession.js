// api/createVerificationSession.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const verificationSession = await stripe.identity.verificationSessions.create({
        type: 'document', // adjust based on what you need (document, selfie, etc.)
      });
      res.status(200).json({ client_secret: verificationSession.client_secret });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
