# 🦷 Dental Horizon

A modern dental clinic management system built with **Laravel 11**, **React 18**, **Inertia.js**, and **Tailwind CSS**. Features a clean dashboard for front-desk staff to manage appointments, patients, payments, and daily schedules.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Backend    | Laravel 11 (PHP 8.2+)               |
| Frontend   | React 18 + Inertia.js               |
| Styling    | Tailwind CSS v3                     |
| Icons      | Lucide React                        |
| Build Tool | Vite 6                              |
| Database   | MySQL 8 / PostgreSQL 15 / SQLite    |
| Auth       | Laravel Breeze (Inertia/React stack)|

---

## Prerequisites

Make sure the following are installed on your machine before you begin.

| Tool        | Minimum Version | Check Command          |
|-------------|-----------------|------------------------|
| PHP         | 8.2             | `php -v`               |
| Composer    | 2.x             | `composer --version`   |
| Node.js     | 18 LTS          | `node -v`              |
| npm         | 9+              | `npm -v`               |
| MySQL/Postgres/SQLite | any  | —                      |

> **macOS:** Install PHP and Composer via [Laravel Herd](https://herd.laravel.com/) (recommended) or Homebrew.  
> **Windows:** Use [Laravel Herd for Windows](https://herd.laravel.com/) or WSL2 with Ubuntu.  
> **Linux:** Use your distro's package manager.

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/dental-horizon.git
cd dental-horizon
```

---

### 2. Install PHP Dependencies

```bash
composer install
```

---

### 3. Configure Environment

Copy the example env file and generate an application key:

```bash
cp .env.example .env
php artisan key:generate
```

Open `.env` and set your database credentials:

```env
APP_NAME="Dental Horizon"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dental_horizon
DB_USERNAME=root
DB_PASSWORD=your_password
```

> **Using SQLite (quickest local setup):**
> ```env
> DB_CONNECTION=sqlite
> # Leave all other DB_ lines blank or remove them
> ```
> Then create the file: `touch database/database.sqlite`

---

### 4. Run Database Migrations

```bash
php artisan migrate
```

Optionally seed demo data:

```bash
php artisan db:seed
```

---

### 5. Install Node Dependencies

```bash
npm install
```

---

### 6. Install Laravel Breeze (Auth Scaffolding)

This project uses Breeze with the Inertia + React stack:

```bash
composer require laravel/breeze --dev
php artisan breeze:install react
php artisan migrate
```

> If you already ran migrations in Step 4, the Breeze migration will just add the `users` and `sessions` tables if they don't exist yet.

---

### 7. Build Frontend Assets

**Development (with hot-reload):**

```bash
npm run dev
```

**Production build:**

```bash
npm run build
```

---

### 8. Start the Development Server

In a **new terminal** (keep `npm run dev` running in the first):

```bash
php artisan serve
```

Visit **http://localhost:8000** in your browser.

---

## Project Structure

```
dental-horizon/
├── app/
│   └── Http/
│       └── Controllers/
│           └── DashboardController.php   # Dashboard data
├── resources/
│   ├── css/
│   │   └── app.css                       # Tailwind + CSS variables
│   ├── js/
│   │   ├── app.jsx                       # Inertia entry point
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   ├── ScheduleTable.jsx
│   │   │   ├── QuickActions.jsx
│   │   │   └── RecentPayments.jsx
│   │   └── pages/
│   │       └── Dashboard.jsx             # Main dashboard page
│   └── views/
│       └── app.blade.php                 # Root Blade layout
├── routes/
│   └── web.php                           # Application routes
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Available Routes

| Method | URI              | Name                  | Description               |
|--------|------------------|-----------------------|---------------------------|
| GET    | `/`              | —                     | Redirects to `/dashboard` |
| GET    | `/dashboard`     | `dashboard`           | Main dashboard            |
| GET    | `/patients`      | `patients.index`      | Patient list              |
| GET    | `/appointments`  | `appointments.index`  | Appointment calendar      |
| GET    | `/payments`      | `payments.index`      | Payment records           |
| GET    | `/reports`       | `reports.index`       | Analytics & reports       |
| GET    | `/settings`      | `settings.index`      | Clinic settings           |

Auth routes (`/login`, `/register`, `/logout`) are handled automatically by Breeze.

---

## Design System

Design tokens are defined as CSS custom properties in `resources/css/app.css` and mapped to Tailwind utilities in `tailwind.config.js`.

| Token                  | Value     | Usage                        |
|------------------------|-----------|------------------------------|
| `--color-background`   | `#f8fafc` | Page background              |
| `--color-surface`      | `#ffffff` | Cards, sidebar, header       |
| `--color-primary`      | `#1e3a8a` | Active nav, buttons, badges  |
| `--color-border`       | `#cbd5e1` | All dividers and outlines    |
| `--color-success`      | `#10b981` | Status badges, trends        |
| `--color-muted`        | `#64748b` | Secondary text               |

**Typography:** DM Sans (Google Fonts) — loaded via `app.blade.php`.

---

## Development Workflow

```bash
# Run both servers simultaneously (recommended)
# Terminal 1 — Hot Module Replacement
npm run dev

# Terminal 2 — Laravel
php artisan serve

# Run tests
php artisan test

# Format PHP code (requires Laravel Pint)
./vendor/bin/pint

# Clear all caches
php artisan optimize:clear
```

---

## Troubleshooting

### Page loads but styles are missing
Make sure `npm run dev` is still running. If you're in production, run `npm run build` first.

### `Class not found` PHP errors
Run `composer dump-autoload` to refresh the autoloader.

### Inertia page not found (e.g. `Dashboard`)
Ensure your React page file is named exactly as the string passed to `Inertia::render()` — e.g. `render('Dashboard')` → `resources/js/pages/Dashboard.jsx`.

### Vite manifest not found
Run `npm run build` (for production) or ensure `npm run dev` is running (for development).

### Database connection refused
Double-check your `.env` credentials. For MySQL, ensure the database exists:
```sql
CREATE DATABASE dental_horizon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Deployment (Production)

```bash
# Install dependencies (no dev)
composer install --optimize-autoloader --no-dev

# Build frontend
npm ci && npm run build

# Run migrations
php artisan migrate --force

# Cache config, routes, views
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Point your web server (Nginx/Apache) document root to `public/`.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

This project is open-sourced under the [MIT License](LICENSE).





composer create-project laravel/laravel DentalHorizonPRMS
cd DentalHorizonPRMS <!--go inside the project -->

<!-- Set Up Database-->
Open XAMPP (or your MySQL server).
Create a database dentalhorizonedb
In .env file, update:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dentalhorizon
DB_USERNAME=root
DB_PASSWORD=


git remote -v //PARA ICHECK ANG REMOTE ORIGINS

git remote add devops https://DMCCFI-CCS@dev.azure.com/DMCCFI-CCS/Dental%20Horizon%20-%20Patient%20Record%20Management%20System/_git/DentalHorizone.git //PARA ICLONE UG APIL ANG REPO SA DEVOPS

git push devops main //PARA IPUSH IMONG MGA GIPANG COMMIT SA DEVOPS

npm install

npm install lucide-react