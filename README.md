# Severum — Plateforme Haut de Gamme de Boosting & Coaching LoL

Plateforme complète de boosting et coaching League of Legends (Master, Grandmaster, Challenger).
Design Dark Ruby haute performance, architecture unifiée React + Express + Prisma SQLite, dashboards modulaires et chat chiffré en temps réel.

---

## 🚀 Fonctionnalités Clés

- **Système de Commande & Calculateur Haute Précision** : sélection des paliers (Fer à Challenger), divisions, LP, mode duo, stream, champions spécifiques.
- **Dashboard Client** : suivi de progression en direct, statut du booster, identifiants chiffrés, mise en pause et reprise en 1 clic.
- **Console Booster** : console de match en direct (+1 victoire/défaite, LP en temps réel, palier cible), marketplace des commandes disponibles, gestion de portefeuille et demandes de virement (PayPal, SEPA, Crypto).
- **Centre de Contrôle Administrateur** : métriques de volume brut (GMV), marge nette Severum, attribution et réassignation des commandes avec liste des boosters, validation des virements.
- **Chat Privé par Commande** : messagerie en direct client/booster/admin avec badges de rôle, protection anti stream-sniping et verrouillage de défilement.

---

## 🛠️ Installation & Démarrage Rapide

### 1. Cloner et installer les dépendances
```bash
git clone https://github.com/Nitrovinzleo/Boost-shop.git
cd Boost-shop
npm install
```

### 2. Base de données & Initialisation (Prisma SQLite)
```bash
npx prisma db push --schema=server/prisma/schema.prisma
node server/seed.js
```

### 3. Lancer les serveurs
- **Serveur Backend API** (Port 3001) :
```bash
node server/server.js
```
- **Serveur Frontend Vite** (Port 5173) :
```bash
npm run dev
```

---

## 🔑 Comptes de Démonstration (Pré-configurés)

Mot de passe commun : `severum1234`

| Rôle | Email |
| :--- | :--- |
| **Administrateur** | `admin@severum.gg` |
| **Booster** | `booster@severum.gg` |
| **Client** | `client@severum.gg` |
