# Dear Desserts - Premium Dessert Cafe Platform

A full-stack food ordering web application for a premium dessert cafe.

## Features

- **Customer Website**: Home, Menu, Cart, Checkout, Order Tracking
- **Admin Panel**: Dashboard, Kanban Orders, Menu Management, Analytics, Offers, Settings
- **Real-time**: Socket.io for live order updates
- **PWA**: Installable on mobile devices

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB, Socket.io
- **Auth**: JWT authentication

## Setup

### Backend
`ash
cd backend
npm install
npm run dev
`

### Frontend
`ash
cd frontend
npm install
npm run dev
`

## Environment Variables

### Backend (.env)
`
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
`

### Frontend (.env)
`
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
`

## Admin Login
- Email: admin@deardesserts.com
- Password: admin123

---
Built with love for Dear Desserts 🍰
