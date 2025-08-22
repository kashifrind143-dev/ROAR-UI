export async function POST(){
  // Mock claim: always returns 10 ROAR
  return new Response(JSON.stringify({ success:true, reward:10 }), { status:200, headers: { "Content-Type":"application/json" } });
}
