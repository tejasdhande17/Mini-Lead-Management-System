# Mini Lead Management System

## Project Overview

A full-stack Lead Management System built using:

* React.js
* Node.js
* Express.js
* MySQL
* JWT Authentication

The system allows Managers to create leads and automatically assign them to Agents.

---

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Role Based Authorization
* Admin / Manager / Agent Roles

### Lead Management

* Create Lead
* Update Lead
* Delete Lead
* View Lead Details
* List Leads

### Lead Assignment

* Automatic Lead Assignment
* Least Loaded Agent Strategy

### Activity Logs

* Lead Created
* Lead Updated
* Lead Assigned
* Status Changed

### Search & Filters

* Pagination
* Search
* Sorting
* Status Filtering
* Source Filtering

### Third Party Integration

* Random User API Enrichment

---

## Backend Setup

```bash
cd Backend
npm install
npm run dev
```

Server runs on:

http://localhost:5000

---

## Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on:

http://localhost:5173

---

## Environment Variables

Create .env

PORT=5000

DB_HOST=localhost

DB_USER=root

DB_PASSWORD=root123

DB_NAME=lead_management_db

JWT_SECRET=your_super_secret_key_123

JWT_EXPIRE=24h

---

## Demo Credentials

Admin

Email: [admin@example.com](mailto:admin@example.com)

Password: pass123

Manager

Email: [manager1@example.com](mailto:manager1@example.com)

Password: pass123

Agent

Email: [agent1@example.com](mailto:agent1@example.com)

Password: pass123

---

## Assumptions

* MySQL is installed locally.
* Users are preloaded into database.
* JWT token stored in localStorage.

---

## Future Improvements

* Refresh Token
* Redis Cache
* Docker
* Swagger
* Unit Testing
* Queue Based Assignment
* WebSocket Notifications
