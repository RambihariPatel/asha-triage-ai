# Go Business - Referral Dashboard

A modern, responsive referral management dashboard built using **React.js**. This application allows authenticated users to manage referrals, view earnings, search and sort referral records, and access detailed referral information through a secure and intuitive interface.

---

# Live Demo

https://go-business-referral-dashboard-kohl.vercel.app/login

# GitHub Repository

https://github.com/RambihariPatel/go-business-referral-dashboard

---

# Project Overview

The Referral Dashboard is a frontend web application developed as part of a frontend coding assessment.

The application provides a complete referral management experience including secure authentication, protected routing, dashboard analytics, referral management, searching, sorting, pagination, referral sharing, and detailed referral pages.

The project follows modern React development practices with reusable components, clean folder structure, responsive layouts, and API integration.

---

# Features

## Authentication

* Secure Login using API
* JWT Authentication
* Token stored using Cookies
* Protected Routes
* Automatic redirect after successful login
* Logout functionality
* Unauthorized users redirected to Login page

---

## Dashboard

* Overview Metrics
* Service Summary
* Referral Link
* Referral Code
* Copy Referral Link
* Copy Referral Code
* Responsive Dashboard Layout

---

## Referral Management

* View all referrals
* Search referrals by partner name
* Search referrals by service
* Sort referrals by date
* Client-side Pagination
* Click any referral to view details

---

## Referral Details

* View complete referral information
* Service Name
* Referral ID
* Profit
* Date
* Back to Dashboard navigation

---

## Error Handling

* Invalid Login Error
* API Error Handling
* Loading State
* Empty Search State
* 404 Not Found Page

---

# Tech Stack

* React.js
* React Router DOM
* JavaScript (ES6+)
* CSS3
* Axios / Fetch API
* js-cookie
* Vite

---

# Project Structure

```text
src
│
├── components
│   ├── Navbar
│   ├── ProtectedRoute
│   ├── Footer
│   ├── Overview
│   ├── ServiceSummary
│   ├── ReferralTable
│   └── ShareReferral
│
├── pages
│   ├── Login
│   ├── Dashboard
│   ├── ReferralDetails
│   └── NotFound
│
├── services
│   └── api.js
│
├── utils
│
├── App.jsx
└── main.jsx
```

---

# Authentication Flow

1. User enters Email and Password.
2. Login API validates credentials.
3. JWT Token is received from the server.
4. Token is stored in Cookies.
5. Protected routes become accessible.
6. Logout removes the token and redirects the user to Login.

---

# API Endpoints

## Login

```http
POST /api/auth/signin
```

---

## Get Referrals

```http
GET /api/referrals
```

---

## Search Referrals

```http
GET /api/referrals?search=value
```

---

## Sort Referrals

```http
GET /api/referrals?sort=asc
```

---

## Referral Details

```http
GET /api/referrals?id=1
```

---

# Main Functionalities

* Secure Authentication
* Protected Routes
* Dashboard Overview
* Dynamic API Integration
* Search Functionality
* Sorting by Date
* Client-side Pagination
* Referral Detail Page
* Responsive UI
* Logout
* Error Handling

---

# Responsive Design

The application is fully responsive and optimized for:

* Mobile Devices
* Tablets
* Laptops
* Desktop Screens

---

# Accessibility

The application follows accessibility best practices including:

* Semantic HTML
* Accessible Forms
* Proper Labels
* Keyboard Navigation
* Readable Typography
* Screen Reader Friendly Structure

---

# Performance Optimizations

* Reusable Components
* Efficient State Management
* Optimized API Calls
* Client-side Pagination
* Clean Component Architecture
* Minimal Re-renders

---

# Installation

Clone the repository

```bash
git clone <your-github-repository-url>
```

Move into the project

```bash
cd referral-dashboard
```

Install dependencies

```bash
npm install
```

Start development server

```bash
npm run dev
```

Create production build

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

# Login Credentials

```text
Email:
admin@example.com

Password:
admin123
```

---

# Future Improvements

* Dark Mode
* Export Referral Reports
* Advanced Filters
* Charts & Analytics
* Notification System
* Profile Management

---

# Author

**Rambihari Patel**

Frontend Developer

GitHub: *Add your GitHub Profile*

LinkedIn: *Add your LinkedIn Profile*

---

# License

This project was developed for a Frontend Coding Assessment and is intended for educational and evaluation purposes.
