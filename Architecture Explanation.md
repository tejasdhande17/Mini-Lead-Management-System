# Architecture Explanation

## Project Architecture

Frontend

React + Bootstrap

↓

REST API

↓

Node.js + Express

↓

Service Layer

↓

MySQL Database

---

## Folder Structure

Backend

* controllers
* services
* routes
* middleware
* config
* utils

Frontend

* pages
* components
* context
* api

---

## Authentication Flow

1. User logs in.
2. Backend validates credentials.
3. JWT Token generated.
4. Token sent to frontend.
5. Protected APIs validate token.

---

## Lead Assignment Logic

Implemented Least Loaded Agent Algorithm.

Steps:

1. Count leads assigned to each agent.
2. Select agent with minimum count.
3. Assign lead automatically.

Benefits:

* Fair Distribution
* Scalable
* Easy Maintenance

---

## Scalability Considerations

* Service Layer Architecture
* Indexed Database Columns
* Stateless JWT Authentication
* Modular Routing
* Reusable Components

---

## Challenges Faced

* Auto Assignment Logic
* Role Based Authorization
* Search and Filtering
* Activity Logging

---

## Improvements

* Docker Deployment
* Swagger Documentation
* Redis Caching
* Unit Testing
* Queue Processing
