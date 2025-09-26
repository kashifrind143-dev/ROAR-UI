import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function POST(request) {
  try {
    await client.connect();
    const db = client.db("roar");
    const users = db.collection("users");

    const { address, username, photo_url, telegramId } = await request.json();

    const user = await users.updateOne(
      { address: address },
      { $set: { username: username, photo_url: photo_url, telegramId: telegramId } },
      { upsert: true }
    );

    return new Response(JSON.stringify({ message: 'User saved successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to save user' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } finally {
    await client.close();
  }
}
