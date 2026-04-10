# Don Bosko — Backend (Faza II) · Supabase + Express

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Plotëso SUPABASE_URL, SUPABASE_SERVICE_KEY dhe JWT_SECRET
```

## Supabase — Hapat

1. Krijo projekt falas në [supabase.com](https://supabase.com)
2. Shko te **SQL Editor** dhe ekzekuto të gjithë kodin nga `supabase_schema.sql`
3. Kopjo **Project URL** dhe **service_role key** nga Settings > API
4. Vendosi në `.env`

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
2. Lidhe me GitHub repo-n (`backend/` folder)
3. Shto variablat nga `.env.example` në panelin e Railway
4. Testo: `GET /api/health` → `{ status: 'ok' }`

## Variablat e nevojshme (.env)

| Variabla | Vlera |
|----------|-------|
| `SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | service_role key nga Supabase |
| `JWT_SECRET` | string i gjatë random |
| `JWT_EXPIRES_IN` | `8h` |
| `PORT` | `3001` |
| `FRONTEND_URL` | `https://sekretaria.vercel.app` |

## Lidhja me Frontend-in

Shto në `.env.production` të projektit React:
```
VITE_API_URL=https://donbosko-backend.railway.app
```
