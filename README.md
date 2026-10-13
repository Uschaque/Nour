# Nour

Nour is a mobile-first Progressive Web App that calculates prayer times from a selected city or the device’s location, then sends a simple reminder when each prayer begins.

## Features

- optional geolocation, stored only in the browser;
- manual country and city selection;
- Muslim World League, UOIF, ISNA, Egyptian General Authority and Umm al-Qura calculation methods;
- prayer times calculated locally with the selected city’s time zone;
- a live countdown to the next prayer;
- installation as an app on iPhone, iPad and Android;
- Web Push notifications even when the app is closed;
- offline access to the interface and previously configured prayer times;
- a responsive, accessible interface.

## Privacy

- The selected city and GPS coordinates remain in `localStorage` on the user’s device.
- City search sends only the entered country and city to Open-Meteo.
- The notification server receives only the Web Push subscription and calculated UTC prayer times for the next 31 days.
- The private VAPID key must be stored in Netlify’s secret environment variables and must never be committed to this repository.
- Content Security Policy and other security headers are defined in `netlify.toml`.

## Project structure

```text
dist/                       Static website and PWA
netlify/functions/          Web Push subscription and delivery functions
netlify.toml                Publishing, functions and security headers
package.json                Netlify Function dependencies
NETLIFY_SETUP.md            Complete production deployment guide
```

## Deploying to Netlify

1. Import this repository into Netlify.
2. Add `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` and `VAPID_SUBJECT` under **Project configuration → Environment variables**.
3. Mark `VAPID_PRIVATE_KEY` as a secret value.
4. Redeploy the project and set its visibility to **Public**.

See [NETLIFY_SETUP.md](./NETLIFY_SETUP.md) for the complete commands and iPhone setup instructions.

## Local development

The contents of `dist/` can be served by any static HTTP server. Web Push functions require the Netlify environment and VAPID variables.

## Security

Do not commit a `.env` file. `.env*`, `node_modules/` and `.netlify/` are ignored by Git. Before every release, verify that no private key, token, personal data or precise user location is present in tracked files.
