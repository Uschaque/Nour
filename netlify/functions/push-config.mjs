export default async function handler(request) {
  if (request.method !== 'GET') return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET' } });
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  return Response.json({ configured: Boolean(publicKey), publicKey: publicKey || null }, { headers: { 'cache-control': 'no-store' } });
}

export const config = { path: '/.netlify/functions/push-config' };
