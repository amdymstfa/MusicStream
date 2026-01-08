# 🎵 MusicStream

Application de gestion et de lecture de musique locale développée avec **Angular 17**.

MusicStream permet aux utilisateurs d'importer, organiser et écouter leurs fichiers audio locaux via une interface simple, moderne et réactive, tout en mettant en pratique une architecture Angular propre et maintenable.

---

## 🚀 Objectifs du projet

* Mettre en œuvre une **application Angular moderne** (Angular 17+)
* Utiliser une **gestion d'état via Services + RxJS / Signals**
* Implémenter un **CRUD complet** pour des pistes audio locales
* Gérer la **lecture audio** avec un lecteur personnalisé
* Appliquer les **bonnes pratiques Angular** (lazy loading, standalone components, DI)

---

## 🛠️ Technologies utilisées

* **Angular 17** (Standalone API)
* **TypeScript**
* **RxJS / Signals**
* **Reactive Forms**
* **HTMLAudioElement / Web Audio API**
* **IndexedDB** (stockage des fichiers audio)
* **CSS** (ou framework UI selon évolution)
* **Jasmine / Karma** (tests)

---

## 📁 Architecture du projet

```text
src/app
├── core
│   ├── models          # Interfaces et modèles (Track, etc.)
│   └── services        # Services métier (audio, storage, tracks)
│
├── features
│   ├── library         # Bibliothèque musicale
│   │   ├── library     # Liste des tracks
│   │   └── track-detail# Détail et lecture d’un track
│   │
├── shared
│   ├── components      # Composants réutilisables
│   └── pipes           # Pipes personnalisés
│
├── app.routes.ts       # Routing principal (lazy loading)
├── app.config.ts       # Configuration globale
└── app.component.*     # Composant racine
```

---

## 🎧 Fonctionnalités principales

### Gestion des tracks (CRUD)

* Ajouter une piste audio locale
* Modifier les métadonnées d’un track
* Supprimer un track
* Consulter la liste complète

### Métadonnées d’un track

* Titre (max 50 caractères)
* Artiste
* Description optionnelle (max 200 caractères)
* Date d’ajout (automatique)
* Durée (calculée automatiquement)
* Catégorie musicale (pop, rock, rap, etc.)
* Image de couverture (optionnelle)

### Lecteur audio

* ▶️ Play / ⏸ Pause
* ⏭ Next / ⏮ Previous
* 🔊 Contrôle du volume
* ⏱ Barre de progression
* Gestion des états : `playing`, `paused`, `buffering`, `stopped`

---

## 💾 Gestion du stockage

* Stockage **côté client**
* Utilisation de **IndexedDB** (recommandé pour fichiers volumineux)
* Séparation claire entre :

  * Fichiers audio
  * Métadonnées

### Contraintes

* Taille maximale par fichier : **10 MB**
* Formats supportés : **MP3, WAV, OGG**
* Images : **PNG, JPEG**

---

## ✅ Validations & gestion d’erreurs

* Validation des formulaires (Reactive Forms)
* Vérification des formats de fichiers
* Gestion des erreurs de stockage
* Messages UI adaptés aux états (`loading`, `error`, `success`)

---

## 🧪 Tests

* Tests unitaires des services
* Tests des composants principaux
* Jasmine / Karma

---

## 🐳 Bonus (optionnels)

* Drag & drop pour réorganiser les tracks
* API externe de lyrics
* Dockerisation de l’application

---

## 📦 Installation & lancement

```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement
ng serve
```

Accéder à l’application :

```
http://localhost:4200
```

---

## 📅 Planning

* **Durée** : 10 jours
* **Début** : 05/01/2026
* **Fin** : 16/01/2026

---

## 📎 Livrables

* 📁 Code source : GitHub
* 📊 Suivi projet : Jira
* 📄 Documentation : README.md

---

## 👤 Auteur

**Moustapha Ndiaye**

---

🎶 *MusicStream – Simple. Local. Efficient.*
