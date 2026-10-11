# Nour

Nour est une PWA mobile-first qui calcule les horaires de prière selon la ville choisie ou la position de l’appareil, puis envoie des rappels simples au moment de chaque prière.

## Fonctionnalités

- géolocalisation facultative, conservée uniquement dans le navigateur ;
- sélection manuelle par pays et ville ;
- méthodes de calcul Ligue mondiale, UOIF, ISNA, Égypte et La Mecque ;
- horaires calculés localement, avec gestion du fuseau horaire de la ville ;
- compte à rebours avant la prochaine prière ;
- installation comme application sur iPhone, iPad et Android ;
- notifications Web Push lorsque l’application est fermée ;
- fonctionnement hors ligne pour l’interface et les horaires déjà configurés ;
- interface responsive et accessible.

## Confidentialité

- La ville et les coordonnées GPS restent dans `localStorage` sur l’appareil.
- La recherche de ville transmet uniquement le pays et la ville saisis à Open-Meteo.
- Le serveur de notifications reçoit uniquement l’abonnement Web Push et les heures UTC calculées pour les 31 prochains jours.
- La clé privée VAPID doit être enregistrée dans les variables secrètes Netlify et ne doit jamais être ajoutée au dépôt.
- Une politique CSP et des en-têtes de sécurité sont définis dans `netlify.toml`.

## Structure

```text
dist/                       Site statique et PWA
netlify/functions/          Fonctions d’abonnement et d’envoi Web Push
netlify.toml                Publication, fonctions et en-têtes de sécurité
package.json                Dépendances des fonctions Netlify
NETLIFY_SETUP.md            Guide complet de mise en production
```

## Déploiement Netlify

1. Importer ce dépôt dans Netlify.
2. Ajouter les variables `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` et `VAPID_SUBJECT` dans **Project configuration → Environment variables**.
3. Marquer `VAPID_PRIVATE_KEY` comme secret.
4. Redéployer puis régler la visibilité du projet sur **Public**.

Consultez [NETLIFY_SETUP.md](./NETLIFY_SETUP.md) pour les commandes et les instructions iPhone détaillées.

## Développement local

Le contenu de `dist/` peut être servi par n’importe quel serveur HTTP statique. Les fonctions Web Push nécessitent l’environnement Netlify et les variables VAPID.

## Sécurité

Ne créez pas de fichier `.env` versionné. Les fichiers `.env*`, `node_modules/` et `.netlify/` sont ignorés par Git. Avant chaque publication, vérifiez qu’aucune clé privée, aucun jeton et aucune donnée personnelle n’est inclus dans les fichiers suivis.
