# LeadFlow AI - Mini Lead Management System

A premium, modern, and production-ready Mini Lead Management System built with **React**, **Node.js (Express)**, and **MySQL**. This system supports JWT-based authentication, role-based access controls, automatic lead assignment logic, comprehensive observability tracking, and external API data enrichment.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/installer/) (running locally or a cloud MySQL instance)

---

## 🛠️ Database Setup

1. Start your local **MySQL Server**.
2. Open your MySQL client (e.g., MySQL Workbench, phpMyAdmin, or terminal) and create a database named `lead_management_db` (Optional, the script does this automatically):
   ```sql
   CREATE DATABASE lead_management_db;
   ```
3. Update the credentials in `backend/.env` if your local MySQL configuration uses a custom password or username.

---

## ⚙️ Project Configuration (.env)

### Backend Settings (`Backend/.env`)
Create a file named `.env` in the `Backend` directory (one is already prepared with default local values):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=lead_management_db
JWT_SECRET=your_super_secret_key_123
JWT_EXPIRE=24h
NODE_ENV=development
```

---

## 🏃‍♂️ How to Run

Follow these simple steps to run both the Backend and Frontend concurrently.

### 1. Run the Backend Setup & Server
Open a terminal in the project directory, navigate to the `Backend` folder, initialize the database tables/seeding, and start the development server:

```bash
# Navigate to Backend folder
cd Backend

# Run Database Initialization (Creates Tables & Seeds Demo Users)
node src/db/init.js

# Start backend server
npm start
```
*The server will run on `http://localhost:5000`.*

### 2. Run the Frontend Development Server
Open a **new** terminal, navigate to the `Frontend` folder, and launch the Vite development server:

```bash
# Navigate to Frontend folder
cd Frontend

# Start the frontend
npm run dev
```
*The UI will run on `http://localhost:5173` (or the port specified in terminal).*

---

## 🔑 Demo Credentials

Once the database initialization script runs successfully, the following dummy accounts will be generated for quick validation:

| Role | Username (Email) | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password123` |
| **Manager** | `manager@example.com` | `password123` |
| **Agent** | `agent@example.com` | `password123` |

---

## 🌟 Key Features

1. **Authentication & Authorization**: JWT token lifecycle management. Pages and API endpoints are protected using middleware restricting access by user role: `Admin`, `Manager`, or `Agent`.
2. **Auto-Assignment Logic (Least-Loaded Agent)**: Real-time calculation on lead creation assigns the lead to the agent with the lowest operational burden.
3. **Observability Logs**: All major CRUD events are recorded in `activity_logs` referencing the acting user and target lead.
4. **Interactive Lead Tables**: Features search capability, status filters, sorting, and full client-side pagination.
5. **Data Enrichment**: Integrated the **RandomUser API** internally as a mock data-provider to fetch utility metadata securely backend-side.
