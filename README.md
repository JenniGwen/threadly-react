# Threadly — belajar React + Laravel (ureeka)

Twitter clone sederhana untuk materi kelas.

```
threadly-react/
├── web/        React + Vite (frontend)
├── api/        Laravel (backend REST API)
├── _solution/  kunci jawaban latihan React
└── SESI-*.md   catatan materi per sesi
```

## Jalankan

Backend (terminal 1):

```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve          # http://127.0.0.1:8000
```

Frontend (terminal 2):

```bash
cd web
npm install
npm run dev                # http://localhost:5173, /api di-proxy ke Laravel
```

Login: `calista` / `123456`

## Materi

- [Sesi 2 — Hooks](SESI-2-HOOKS.md)
- Sesi 5 — Database & Migration, Model, endpoint `compact()`
- [Sesi 6 — Middleware & Validation](SESI-6-MIDDLEWARE-VALIDATION.md)
