import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(request) {
  try {
    await client.connect();
    const db = client.db("roar");
    const users = db.collection("users");

    const { address } = await request.json();

    const user = await users.findOne({ address: address });

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const now = Date.now();
    const lastClaim = user.lastClaim || 0;
    const timeSinceLastClaim = now - lastClaim;
    const fourHours = 4 * 60 * 60 * 1000;

    if (timeSinceLastClaim < fourHours) {
      const timeLeft = fourHours - timeSinceLastClaim;
      return new Response(JSON.stringify({ message: 'Reward can be claimed after 4 hours', timeLeft }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const newBalance = (user.balance || 0) + 10;

    await users.updateOne(
      { address: address },
      { $set: { balance: newBalance, lastClaim: now } }
    );

    return new Response(JSON.stringify({ message: 'Reward claimed successfully', balance: newBalance }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to claim reward' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } finally {
    await client.close();
  }
}
