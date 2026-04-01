# suivi-saeg

Application web de suivi de préparation au concours SAEG (cadre général).

## Stack

| Composant | Rôle |
|-----------|------|
| [PocketBase](https://pocketbase.io) | Backend : API REST + serveur de fichiers statiques |
| SQLite | Base de données, gérée automatiquement par PocketBase |
| Alpine (Docker) | Image de base minimale |

PocketBase sert à la fois le frontend (`pb_public/`) et l'API (`/api/`) sur le **même port (8080)**.
Les URLs dans le frontend sont donc toutes relatives — aucun hostname codé en dur.

## Structure

```
suivi-saeg/
├── Dockerfile
├── .dockerignore
├── CLAUDE.md
├── suivi_concours_SAEG.html   # Source originale (référence, non utilisée en prod)
├── pb_public/
│   └── index.html             # Frontend servi par PocketBase
└── pb_migrations/
    └── 1_init.js              # Crée les collections seances et trophees_unlocked
```

Les données sont persistées dans `/pb/pb_data/` (volume Docker à monter).

## Collections PocketBase

### `seances`
| Champ | Type | Description |
|-------|------|-------------|
| `type` | text | `rev1` \| `rev2` \| `esp` |
| `dur` | number | Durée en minutes |
| `date_sort` | text | Date au format `YYYY-MM-DD` |
| `theme` | text | Thème travaillé |

### `trophees_unlocked`
| Champ | Type | Description |
|-------|------|-------------|
| `trophy_id` | text (unique) | Identifiant du trophée débloqué |

Toutes les règles d'accès sont ouvertes (`""`) — l'application est destinée à un homelab privé.

## Commandes utiles

### Build de l'image

```bash
docker build -t ghcr.io/fait-maison/suivi-saeg:latest .
```

Pour forcer une version de PocketBase :

```bash
docker build --build-arg PB_VERSION=0.23.4 -t ghcr.io/fait-maison/suivi-saeg:latest .
```

### Run local

```bash
docker run -p 8080:8080 -v $(pwd)/pb_data:/pb/pb_data ghcr.io/fait-maison/suivi-saeg:latest
```

Accéder à l'application : http://localhost:8080
Accéder à l'admin PocketBase : http://localhost:8080/_/

### Push sur ghcr.io

```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u <username> --password-stdin
docker push ghcr.io/fait-maison/suivi-saeg:latest
```

## Migrations

Les migrations dans `pb_migrations/` sont appliquées **automatiquement** au démarrage de PocketBase.
Le fichier `1_init.js` crée les deux collections si elles n'existent pas encore.

Pour rejouer les migrations manuellement :

```bash
/pb/pocketbase migrate up --dir=/pb/pb_data
```

## API endpoints utilisés par le frontend

```
GET  /api/collections/seances/records?perPage=500&sort=date_sort
POST /api/collections/seances/records
DEL  /api/collections/seances/records/:id

GET  /api/collections/trophees_unlocked/records?perPage=500
POST /api/collections/trophees_unlocked/records
```
