# Don Bosko — Backend (Faza II)

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Plotëso MONGODB_URI dhe JWT_SECRET në .env
```

## Seed databaza

```bash
npm run seed
```

## Zhvillim lokal

```bash
npm run dev
```

## Deploy (Railway)

1. Krijo projekt të ri në [railway.app](https://railway.app)
2. Lidhe me GitHub repo-n
3. Shto variablat nga `.env.example` në panelin e Railway
4. Railway deploy-on automatikisht me çdo `git push`

## Endpoints kryesore

| Metoda | Route | Funksioni |
|--------|-------|-----------|
| POST | /api/auth/login | Hyrja |
| POST | /api/auth/logout | Dalja |
| POST | /api/auth/change-password | Ndrysho fjalëkalimin |
| GET | /api/classes | Klasat sipas rolit |
| GET | /api/classes/:id/students | Nxënësit e klasës |
| POST | /api/messages/send | Dërgo mesazh WhatsApp |
| POST | /api/messages/correction | Dërgo korrigjim |
| GET | /api/messages/history | Historia |
| GET | /api/templates | Merr shabllonët |
| PUT | /api/templates | Ruaj shabllonin |
| GET | /api/admin/secretaries | Lista sekretareve |
| PUT | /api/admin/reset-password | Rivendos fjalëkalimin |
| GET | /api/admin/activity-feed | Feed aktivitetit |
| GET | /api/whatsapp/qr | QR kodi |
| GET | /api/whatsapp/status | Statusi WhatsApp |
| GET | /api/health | Health check |

## Lidhja me Frontend-in (Alesjo)

Shto në `.env.production` të projektit React:
```
VITE_API_URL=https://donbosko-backend.railway.app
```

Pastaj zëvendëso `localStorage` auth me thirrje JWT reale.
