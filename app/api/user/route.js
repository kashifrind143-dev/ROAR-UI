import mongoose from 'mongoose';

// Define the user schema
const userSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  username: { type: String, default: "IVANNIKOV.PRO" },
  profilePic: { type: String, default: "/avatar.png" },
  totalPoints: { type: Number, default: 0 },
  lastClaimTime: { type: Date, default: null },
});

// Create the user model
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Connect to MongoDB
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams
  const username = searchParams.get('username') || "IVANNIKOV.PRO";
  const user = { username: username, profilePic: "/avatar.png", totalPoints: 1273.926 };
  return new Response(JSON.stringify({ user }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(req) {
  try {
    await connectMongoDB();

    const { address } = await req.json();

    // Check if the user already exists
    let user = await User.findOne({ walletAddress: address });

    if (!user) {
      // Create a new user
      user = await User.create({ walletAddress: address });
      console.log('New user created:', user);
    } else {
      console.log('User already exists:', user);
    }

    return new Response(JSON.stringify({ user }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error('Error creating/fetching user:', error);
    return new Response(JSON.stringify({ error: 'Failed to create/fetch user' }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
