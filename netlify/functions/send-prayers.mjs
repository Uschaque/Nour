import { getStore } from '@netlify/blobs';
import webpush from 'web-push';

const ALLOWED_PRAYERS = new Set(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']);

export default async function handler() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;
  if (!publicKey || !privateKey || !subject) return new Response('Push is not configured', { status: 503 });
  webpush.setVapidDetails(subject, publicKey, privateKey);
  const store = getStore('nour-push-subscriptions');
  const { blobs } = await store.list();
  const now = Date.now();
  let sent = 0;
  for (const blob of blobs.slice(0, 1000)) {
    const record = await store.get(blob.key, { type: 'json' });
    if (!record?.subscription || !Array.isArray(record.schedule)) continue;
    const due = record.schedule.filter(item => ALLOWED_PRAYERS.has(item.prayer) && Date.parse(item.at) <= now && Date.parse(item.at) > now - 120000);
    try {
      for (const item of due) {
        const payload = JSON.stringify({ title: `Il est l’heure de prier ${item.prayer}`, body: `La prière de ${item.prayer} commence maintenant.`, tag: `nour-${item.prayer}-${item.at}`, url: '/' });
        await webpush.sendNotification(record.subscription, payload, { TTL: 300, urgency: 'high' });
        sent++;
      }
      record.schedule = record.schedule.filter(item => Date.parse(item.at) > now);
      if (record.schedule.length) await store.setJSON(blob.key, record); else await store.delete(blob.key);
    } catch (error) {
      if (error?.statusCode === 404 || error?.statusCode === 410) await store.delete(blob.key);
    }
  }
  return Response.json({ ok: true, sent });
}

export const config = { schedule: '* * * * *' };
