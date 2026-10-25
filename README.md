# Abdou Phone — E-commerce Hardware & Accessoires Smartphone

Boutique en ligne multi-pages dédiée aux accessoires de smartphones en Algérie (environ 100 références en catalogue), conçue avec une architecture **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** et un système de stockage hybride résilient (**MongoDB / Mongoose** + cache local).

---

## ⚡ Caractéristiques & Spécifications Clés

1. **Brand Identity & Esthétique**
   - **Logo Officiel** : Emblème géométrique tactile à double bouton toggle (inspiration Swiss Minimalist / Nothing / Teenage Engineering).
   - **Charte Graphique** : Option C Stealth Monochrome + Statut Émeraude (`#090A0D` void, `#13161D` surface, `#252A36` bordures, `#F8FAFC` texte haute lisibilité, `#10B981` pastille vert émeraude "En Stock").

2. **Règles Strictes d'Interface (Zéro Défaut)**
   - **`cursor: pointer` garanti** : Appliqué sur l'ensemble des boutons, liens, cartes produits, sélecteurs et éléments interactifs.
   - **Zéro `<select>` HTML par défaut** : 100% des menus déroulants utilisent le composant sur-mesure `CustomSelect` (recherche intégrée, chevrons animés, design dark hardware).

3. **Zéro Bloatware & Services Tiers Supprimés**
   - ❌ **Pas d'API Yalidine** ni génération de bordereaux externes : la boutique gère son propre cycle de vie de livraison en interne.
   - ❌ **Pas de Pixel Meta** ni de scripts Facebook de traçage.
   - ❌ **Pas de Pixel TikTok**.
   - ❌ **Pas de widget WhatsApp** ni de redirection vers messagerie tierce : les commandes se passent directement sur le site.

4. **Expédition & Paiement Algérie (58 Wilayas)**
   - Matrice complète des 58 wilayas d'Algérie avec calcul automatique des tarifs de livraison (À Domicile vs Point Relais / Stop Desk).
   - Validation des numéros algériens (`05..`, `06..`, `07..`).
   - Modal de commande rapide en 1 clic (`FastOrderModal`) sur chaque carte produit.
   - Page dédiée de suivi de commande en temps réel (`/suivi-commande`) avec timeline dynamique à 5 étapes.

---

## 🚀 Démarrage Rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Lancement du serveur de développement
```bash
npm run dev
```
L'application démarre sur [http://localhost:3001](http://localhost:3001).

### 3. Build de production
```bash
npm run build
npm run start
```

---

## 🔐 Espace Administrateur

- **URL de Connexion** : `/admin/login`
- **Email Admin** : `admin@abdouphone.dz`
- **Mot de Passe** : `adminabdou2026`
- **Fonctionnalités Admin** :
  - Dashboard statistique (Total commandes, Chiffre d'Affaires DZD, Commandes à confirmer par téléphone).
  - Gestion des commandes avec mise à jour immédiate du statut (`En attente` &rarr; `Confirmée` &rarr; `En préparation` &rarr; `Expédiée` &rarr; `Livrée`).
  - Gestionnaire de stock et visibilité des produits du catalogue.
