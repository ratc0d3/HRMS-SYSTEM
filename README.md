# Mini HRMS System

A Human Resource Management System for managing employee information, salary details, attendance, and payroll records.

## Features

- **Login Page** - Admin authentication with database-backed credentials
- **Employee Management** - Add, view, edit, and delete employees with complete details
- **Salary Management** - Set salary details with auto-calculated Net Salary
- **Attendance Management** - Record and track employee attendance
- **Payroll Summary** - Generate and view payroll records with printable summary
- **Dashboard** - Overview of employee statistics and monthly payroll

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React + Vite |
| Backend | Laravel 11 + Sanctum |
| Database | MySQL |

---

## Installation Guide

### Prerequisites

Before installing this system, ensure you have the following installed on your computer:

| Software | Minimum Version | Download Link |
|----------|-----------------|---------------|
| PHP | 8.2+ | https://www.php.net/downloads |
| Composer | 2.0+ | https://getcomposer.org/download/ |
| Node.js | 18.0+ | https://nodejs.org/en/download/ |
| npm | 9.0+ | Included with Node.js |
| MySQL | 5.7+ or 8.0+ | https://dev.mysql.com/downloads/mysql/ |

**For Windows Users:**
- You can use XAMPP (https://www.apachefriends.org/) which includes PHP, MySQL, and Apache
- Make sure to add PHP and MySQL to your system PATH

---

### Step 1: Download the Project

Download or clone the project to your local machine:

```bash
# If using Git
git clone <repository-url>
cd HRMS_system

# Or extract the downloaded ZIP file
```

---

### Step 2: Set Up the Database

1. **Open your MySQL client** (phpMyAdmin, MySQL Workbench, or command line)

2. **Create a new database:**

```sql
CREATE DATABASE hrms_db;
```

Or via phpMyAdmin:
- Go to http://localhost/phpmyadmin
- Click "New" on the left sidebar
- Enter database name: `hrms_db`
- Click "Create"

---

### Step 3: Configure the Backend

1. **Navigate to the backend folder:**

```bash
cd HRMS-backend
```

2. **Install PHP dependencies:**

```bash
composer install
```

3. **Create environment file:**

```bash
# Copy the example environment file
copy .env.example .env    # Windows Command Prompt
# OR
cp .env.example .env      # Git Bash / PowerShell
```

4. **Generate application key:**

```bash
php artisan key:generate
```

5. **Configure database connection:**

Open the `.env` file in a text editor and update the database settings:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hrms_db
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

> **Note:** If using XAMPP, the default username is `root` and password is empty (leave blank).

6. **Run migrations and seed data:**

```bash
php artisan migrate:fresh --seed
```

This command will:
- Create all required database tables
- Insert sample data (admin account, employees, salaries, attendance)

7. **Start the backend server:**

```bash
php artisan serve --host=127.0.0.1 --port=8001
```

You should see:
```
INFO  Server running on [http://127.0.0.1:8001].
```

> **Important:** Keep this terminal window open. The backend must stay running.

---

### Step 4: Configure the Frontend

1. **Open a new terminal window** (keep the backend running)

2. **Navigate to the frontend folder:**

```bash
cd hrms-frontend
```

3. **Install npm dependencies:**

```bash
npm install
```

4. **Start the development server:**

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Step 5: Access the Application

1. **Open your web browser**

2. **Go to:** http://localhost:5173

3. **Login with the following credentials:**

| Field | Value |
|-------|-------|
| Email | `admin@test.com` |
| Password | `admin123` |

---

## Default Data

The system comes pre-loaded with sample data for testing:

### Admin Account
| Email | Password |
|-------|----------|
| admin@test.com | admin123 |

### Sample Employees (5 records)
| Name | Position | Department | Status |
|------|----------|------------|--------|
| Juan Dela Cruz | Software Developer | IT | Active |
| Maria Santos | HR Manager | Human Resources | Active |
| Jose Reyes | Marketing Specialist | Marketing | On Leave |
| Ana Garcia | Accountant | Finance | Resigned |
| Carlo Mendoza | Web Designer | IT | Active |

### Sample Salary Records
Each employee has a pre-configured salary with Basic Salary, Allowance, and Deductions.

### Sample Attendance
Today's attendance records are pre-generated for all employees.

---

## Project Structure

```
HRMS_system/
├── HRMS-backend/              # Laravel Backend
│   ├── app/
│   │   ├── Http/Controllers/  # API Controllers
│   │   └── Models/            # Database Models
│   ├── database/
│   │   ├── migrations/        # Database Migrations
│   │   ├── seeders/           # Sample Data
│   │   └── schema/            # SQL Schema File
│   ├── routes/api.php         # API Routes
│   └── .env                   # Environment Configuration
│
├── hrms-frontend/             # React Frontend
│   ├── src/
│   │   ├── pages/             # Page Components
│   │   ├── components/        # Reusable Components
│   │   └── api/               # API Configuration
│   └── package.json           # NPM Dependencies
│
└── README.md                  # This File
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Admin login |
| POST | `/api/logout` | Admin logout |
| GET | `/api/user` | Get authenticated user |
| GET | `/api/employees` | List all employees |
| POST | `/api/employees` | Create employee |
| GET | `/api/employees/{id}` | Get employee details |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |
| GET | `/api/salaries` | List all salaries |
| POST | `/api/salaries` | Create/Update salary |
| GET | `/api/salaries/{id}` | Get employee salary |
| GET | `/api/attendance` | List attendance records |
| POST | `/api/attendance` | Record attendance |
| DELETE | `/api/attendance/{id}` | Delete attendance |
| GET | `/api/payroll` | List payroll records |
| POST | `/api/payroll/generate` | Generate payroll |
| GET | `/api/dashboard` | Dashboard statistics |

---

## Troubleshooting

### Backend Issues

**Problem:** `php artisan serve` fails with "port in use"
```bash
# Try a different port
php artisan serve --port=8002
```
Then update the frontend API URL in `hrms-frontend/src/api/index.js`

**Problem:** Database connection error
- Verify MySQL is running (check XAMPP or MySQL service)
- Check `.env` database credentials
- Ensure the database `hrms_db` exists

**Problem:** Migration fails
```bash
# Drop all tables and re-run migrations
php artisan migrate:fresh --seed
```

### Frontend Issues

**Problem:** `npm install` fails
```bash
# Clear npm cache and retry
npm cache clean --force
npm install
```

**Problem:** Cannot connect to backend API
- Ensure the backend server is running (Step 3.7)
- Check that the backend is on port 8001
- Verify no firewall is blocking the connection

---

## Ports Used

| Service | Port | URL |
|---------|------|-----|
| Frontend (React) | 5173 | http://localhost:5173 |
| Backend (Laravel) | 8001 | http://localhost:8001 |
| MySQL | 3306 | localhost:3306 |

---

## Requirements Checklist

| Requirement | Status |
|-------------|--------|
| Login Page | ✅ Implemented |
| Employee Management (CRUD) | ✅ Implemented |
| Salary Management | ✅ Implemented |
| Attendance Management | ✅ Implemented |
| Payroll Summary | ✅ Implemented |
| Dashboard Statistics | ✅ Implemented |
| All API Endpoints | ✅ Implemented |
| All Database Tables | ✅ Implemented |

---

## Net Salary Formula

```
Net Salary = Basic Salary + Allowance - Deductions
```

This is automatically calculated when saving salary records.

---

## License

This project is created for assessment purposes.

---

## Support

For any issues or questions, please contact the developer.
