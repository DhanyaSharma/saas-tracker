# SaaS Subscription Tracker

## Overview

SaaS Subscription Tracker is a full-stack web application that helps users manage and monitor their subscription-based services. It provides a centralized dashboard to track expenses, visualize spending patterns, and manage subscriptions efficiently.
---
## Features
* User authentication using JWT
* Add, update, and delete subscriptions
* Track recurring subscription costs
* Categorize subscriptions
* Dashboard with summarized insights
* Data visualization using charts
* RESTful API integration between frontend and backend

---
## Tech Stack
### Frontend
* React
* JavaScript
* CSS

### Backend
* Node.js
* Express.js

### Authentication
* JSON Web Tokens (JWT)

### Data Visualization
* Chart.js / react-chartjs-2

### Tools and Platforms
* Git and GitHub for version control


---

## Project Structure

```
saas-tracker/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── screenshots/
└── README.md
```

---

## Installation and Setup

### Prerequisites

* Node.js installed

---

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/saas-tracker.git
cd saas-tracker
```

---

### Backend Setup

```bash
cd backend
npm install
```

Run the backend:
```bash
node server.js
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## API Endpoints

### Authentication

* POST /api/auth/register
* POST /api/auth/login

### Subscriptions

* GET /api/subscriptions
* POST /api/subscriptions
* PUT /api/subscriptions/:id
* DELETE /api/subscriptions/:id

---

## Screenshots

Add screenshots of your application inside the screenshots folder and reference them here.

Example:
```
![Dashboard](screenshots/dashboard.png)
```


---

## Future Improvements

* Persistent database integration
* Advanced analytics and reporting
* Notifications for upcoming payments

---

## Author

Dhanya Sharma
