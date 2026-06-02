# Database Design

## Users Table

| Column     | Type      |
| ---------- | --------- |
| id         | INT       |
| name       | VARCHAR   |
| email      | VARCHAR   |
| password   | VARCHAR   |
| role       | ENUM      |
| created_at | TIMESTAMP |

---

## Leads Table

| Column      | Type      |
| ----------- | --------- |
| id          | INT       |
| name        | VARCHAR   |
| email       | VARCHAR   |
| phone       | VARCHAR   |
| source      | VARCHAR   |
| status      | ENUM      |
| assigned_to | INT       |
| notes       | TEXT      |
| created_at  | TIMESTAMP |
| updated_at  | TIMESTAMP |

Relationship:

assigned_to → users.id

---

## Activity Logs Table

| Column     | Type      |
| ---------- | --------- |
| id         | INT       |
| lead_id    | INT       |
| user_id    | INT       |
| action     | VARCHAR   |
| details    | TEXT      |
| created_at | TIMESTAMP |

Relationships:

lead_id → leads.id

user_id → users.id

---

## ER Diagram

Users (1) -------- (M) Leads

Users (1) -------- (M) Activity Logs

Leads (1) -------- (M) Activity Logs
