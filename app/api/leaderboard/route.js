export async function GET(){
  const users = [
    { username: "alpha", points: 35210 },
    { username: "bravo", points: 28870 },
    { username: "charlie", points: 17480 },
    { username: "delta", points: 12010 }
  ];
  return new Response(JSON.stringify({ users }), { status:200, headers: { "Content-Type":"application/json" } });
}
