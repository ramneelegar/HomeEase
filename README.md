🏠 HomeEase – Household Services Marketplace
A full-featured demo web app built with React, inspired by Urban Company. Built as a DBMS project.

🚀 Quick Start
Prerequisites
Node.js v16+ installed (download)
npm (comes with Node.js)
Run Locally
# 1. Navigate into the project folder
cd homease

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
App opens at http://localhost:3000

🔑 Demo Login Credentials
Role	Email	Password
Customer	customer@homease.com	password
Provider	arjun@homease.com	password
Provider	kavitha@homease.com	password
Admin	admin@homease.com	admin123
🗂️ Folder Structure
homease/
├── public/
│   └── index.html
├── src/
│   ├── App.js                    # Main app with routing
│   ├── index.js                  # Entry point
│   ├── index.css                 # Global styles & design system
│   ├── context/
│   │   └── AppContext.js         # Global state (auth, bookings, chat, notifications)
│   ├── data/
│   │   └── mockData.js           # Pre-loaded providers, customers, bookings
│   ├── pages/
│   │   └── AuthPages.js          # Login & Signup
│   └── components/
│       ├── shared/
│       │   └── Shared.js         # Navbar, Avatar, Notifications, StarRating, etc.
│       ├── customer/
│       │   ├── CustomerHome.js   # Browse, search, filters, recommendations
│       │   ├── ProviderProfile.js # Provider view + booking modal + reviews
│       │   ├── CustomerBookings.js # My bookings page
│       │   └── CustomerProfile.js  # Customer profile edit
│       ├── provider/
│       │   └── ProviderPages.js  # Dashboard, bookings management, profile edit
│       ├── chat/
│       │   └── ChatPage.js       # Real-time-like chat with localStorage persistence
│       └── admin/
│           └── AdminPanel.js     # Admin dashboard with user/booking management
└── package.json
✅ Features Implemented
Authentication
Login / Signup with role selection (Customer / Provider)
Session persistence via localStorage
Role-based route protection and redirects
Customer Module
Browse service categories (Plumbing, Electrical, Cleaning, Carpentry, Painting, Appliance Repair)
Search by name, service, or location
Filter by rating, price, and location
View provider profiles with portfolio, reviews, availability
Book services with date/time/address selection
Track bookings (Requested → Accepted → Completed)
Write reviews after completed bookings
Provider Module
Dashboard with stats (pending, active, completed, earnings)
Accept / Reject / Complete booking requests
Edit full profile (bio, pricing, category, location, etc.)
View and respond to bookings
Chat System
Real-time-like messaging between customer and provider
Messages persist via localStorage
Timestamps, sender/receiver distinction
Auto-scroll to latest messages
Quick reply suggestions
Notification System
Bell icon with unread count badge
Notifications for: booking request, accepted, rejected, completed, new message
Read/unread state management
Dropdown with notification history
Smart Recommendations
Recommends providers based on past searches and booking history
Falls back to top-rated providers
Admin Panel
Overview with platform stats and category breakdown
Manage all providers (verify/unverify)
View all customers
View all bookings with status
Data Persistence
All data (users, bookings, messages, notifications) stored in localStorage
Persists across page refresh
🎨 Tech Stack
Layer	Tech
Frontend	React 18 (functional components + hooks)
Routing	React Router v6
State	Context API + localStorage
Styling	Pure CSS with CSS Variables (no framework)
Icons	Unicode emoji
Fonts	Fraunces (display) + Plus Jakarta Sans (body)
Images	Unsplash (mock portfolio images)
📊 Mock Data Included
6 Providers – One for each service category, with ratings, reviews, portfolio, and availability
1 Demo Customer – With past bookings and search history
Sample Bookings – In different statuses for demonstration
Chat Messages – Pre-loaded conversation
Notifications – Sample read/unread notifications
🧩 How to Add Real Database (for production upgrade)
Replace mockData.js with API calls to a Node.js/Express backend
Replace localStorage in AppContext.js with fetch() calls to REST endpoints
Add MongoDB/MySQL/PostgreSQL with the same data schema
Add JWT-based authentication
Built for DBMS Project Demo | HomeEase v1.0
