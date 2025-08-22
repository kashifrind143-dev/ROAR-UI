export async function GET(){
  const user = { username: "IVANNIKOV.PRO", profilePic: "/avatar.png", totalPoints: 1273.926 };
  return new Response(JSON.stringify({ user }), { status:200, headers: { "Content-Type":"application/json" } });
}
