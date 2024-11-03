const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const verificationSession = await stripe.identity.verificationSessions.create({
        type: 'document',
      });
      res.status(200).json({ client_secret: verificationSession.client_secret });
    } catch (error) {
      console.error("Error creating Verification Session:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
