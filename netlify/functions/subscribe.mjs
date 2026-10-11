import { createHash } from 'node:crypto';
import { getStore } from '@netlify/blobs';

const ALLOWED_PRAYERS = new Set(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']);
const ALLOWED_PUSH_HOSTS = ['push.apple.com', 'fcm.googleapis.com', 'updates.push.services.mozilla.com', 'notify.windows.com'];

function validPushHost(hostname) {
  return ALLOWED_PUSH_HOSTS.some(host => hostname === host || hostname.endsWith(`.${host}`));
}

function validate(body) {
  const subscription = body?.subscription;
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) throw new Error('Invalid subscription');
  const endpoint = new URL(subscription.endpoint);
  if (endpoint.protocol !== 'https:' || !validPushHost(endpoint.hostname)) throw new Error('Unsupported push service');
  if (!Array.isArray(body.schedule) || body.schedule.length > 200) throw new Error('Invalid schedule');
  const now = Date.now(), maximum = now + 35 * 86400000;
  const schedule = body.schedule.map(item => ({ at: new Date(item.at).toISOString(), prayer: String(item.prayer) })).filter(item => {
    const time = Date.parse(item.at);
    return ALLOWED_PRAYERS.has(item.prayer) && Number.isFinite(time) && time > now - 120000 && time < maximum;
  });
  if (!schedule.length) throw new Error('Empty schedule');
  return { subscription, schedule };
}

export default async function handler(request) {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 150000) return Response.json({ error: 'Payload too large' }, { status: 413 });
  try {
    const { subscription, schedule } = validate(await request.json());
    const key = createHash('sha256').update(subscription.endpoint).digest('hex');
    const store = getStore('nour-push-subscriptions');
    await store.setJSON(key, { subscription, schedule, updatedAt: new Date().toISOString() });
    return Response.json({ ok: true, reminders: schedule.length });
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export const config = { path: '/.netlify/functions/subscribe' };
