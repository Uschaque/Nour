# Deploy Nour to Netlify

## 1. Deploy the complete project

Import this complete repository into Netlify, not only the `dist` directory. Netlify publishes `dist` and automatically detects the functions in `netlify/functions` through `netlify.toml`.

## 2. Generate Web Push keys

From this project directory on your computer, run:

```sh
npm install
npx web-push generate-vapid-keys
```

The command prints a public key and a private key. Never publish the private key or add it to a project file.

## 3. Store the secrets in Netlify

In Netlify, open **Project configuration → Environment variables** and add:

- `VAPID_PUBLIC_KEY`: the generated public key;
- `VAPID_PRIVATE_KEY`: the generated private key, marked **Contains secret values**;
- `VAPID_SUBJECT`: a contact address in the form `mailto:contact@your-domain.com`.

Redeploy the site after saving these variables. The private key is then available only to Netlify Functions and never appears in files served to visitors.

## 4. Make the website public

Under **Project configuration → General → Visitor access → Project visibility**, select **Public**.

## 5. Enable reminders on iPhone

1. Open the website in Safari on iOS 16.4 or later.
2. Tap **Share → Add to Home Screen → Add**.
3. Open Nour from its new Home Screen icon.
4. Tap **Enable reminders** and allow notifications.

Nour sends only the Web Push subscription and calculated UTC prayer times for the next 31 days to the server. The city, country and coordinates remain in the browser.
