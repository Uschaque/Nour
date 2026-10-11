# Déployer Nour sur Netlify

## 1. Déployer le projet complet

Importez ce dossier complet dans Netlify, pas seulement `dist`. Netlify publiera `dist` et détectera automatiquement les fonctions dans `netlify/functions` grâce à `netlify.toml`.

## 2. Créer les clés Web Push

Sur votre ordinateur, dans ce dossier :

```sh
npm install
npx web-push generate-vapid-keys
```

La commande affiche une clé publique et une clé privée. Ne publiez jamais la clé privée et ne l’ajoutez jamais à un fichier du projet.

## 3. Enregistrer les secrets dans Netlify

Dans Netlify, ouvrez **Project configuration → Environment variables** et ajoutez :

- `VAPID_PUBLIC_KEY` : la clé publique générée ;
- `VAPID_PRIVATE_KEY` : la clé privée, marquée **Contains secret values** ;
- `VAPID_SUBJECT` : une adresse de contact sous la forme `mailto:contact@votre-domaine.fr`.

Redéployez ensuite le site. La clé privée est alors disponible uniquement dans les fonctions Netlify et n’apparaît jamais dans les fichiers servis aux visiteurs.

## 4. Rendre le site public

Dans **Project configuration → General → Visitor access → Project visibility**, choisissez **Public**.

## 5. Activer les rappels sur iPhone

1. Ouvrez le site dans Safari sur iOS 16.4 ou une version ultérieure.
2. Touchez **Partager → Sur l’écran d’accueil → Ajouter**.
3. Ouvrez Nour depuis sa nouvelle icône.
4. Touchez **Activer les rappels** et autorisez les notifications.

Nour envoie au serveur uniquement l’abonnement Web Push et les heures UTC des prières pour les 31 prochains jours. La ville, le pays et les coordonnées restent dans le navigateur.
