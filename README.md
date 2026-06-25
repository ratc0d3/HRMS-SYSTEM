# Mini HRMS System

Mini HRMS assessment project built with a Laravel API backend and a React frontend.

## Completed Modules

- Admin login using database-backed credentials
- Employee management with add, view, edit, and delete
- Salary management with automatic net salary calculation
- Attendance management with daily upsert behavior
- Payroll summary and payroll generation
- Dashboard statistics for employees, leave count, and monthly payroll
- Printable payroll page via browser print

## Tech Stack

- Frontend: React + Vite
- Backend: Laravel + Sanctum token authentication
- Database: MySQL

## Demo Login

- Email: `admin@test.com`
- Password: `admin123`

## Project Structure

```text
HRMS_system/
|-- HRMS-backend/
|   |-- app/
|   |-- database/
|   |   |-- migrations/
|   |   |-- schema/mysql-schema.sql
|   |   `-- seeders/
|   `-- routes/
|-- hrms-frontend/
|   `-- src/
`-- README.md
```

## Backend Setup

```bash
cd HRMS-backend
composer install
php artisan key:generate
php artisan migrate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8001
```

Backend base URL:

- `http://127.0.0.1:8001`
- `http://localhost:8001`

## Frontend Setup

```bash
cd hrms-frontend
npm install
npm run dev
```

Frontend URL:

- `http://localhost:5173`

## Important Notes

- The Laravel backend is configured to run on port `8001`.
- The frontend API client points to `http://localhost:8001/api`.
- Seed data includes one admin account plus sample employees, salaries, and attendance.
- Payroll generation includes employees with status `Active` and `On Leave` when no employee is selected.

## Submission Files

- Source code: this repository/workspace
- SQL file: `HRMS-backend/database/schema/mysql-schema.sql`
- README: `README.md`
- Screenshots: add manually before final submission
- GitHub repository link: add manually before final submission

## Requirement Coverage

- Login page: implemented
- Employee CRUD: implemented
- Salary management: implemented
- Attendance management: implemented
- Payroll summary: implemented
- Dashboard: implemented
- Required API endpoints: implemented
- Required database tables: implemented

## API Summary

- `POST /api/login`
- `POST /api/logout`
- `GET /api/user`
- `GET|POST|PUT|DELETE /api/employees`
- `GET|POST /api/salaries`
- `GET|POST|DELETE /api/attendance`
- `GET /api/payroll`
- `POST /api/payroll/generate`
- `GET /api/dashboard`
