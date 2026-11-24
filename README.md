# 🏠 HomeEase – Household Services Marketplace

**HomeEase** is a household services marketplace web application inspired by Urban Company. It connects customers with trusted service providers for everyday household needs. Users can browse services, compare providers, book appointments, track bookings, and communicate with service providers.

Built as a **Database Management Systems (DBMS) Project** using React.

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- npm (comes with Node.js)
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/ramneelegar/HomeEase.git
```

**2. Navigate to the project directory**

```bash
cd HomeEase
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm start
```

**5. Open the application**

Visit:

http://localhost:3000

---

## 🔑 Demo Login Credentials

Use the following credentials to explore different user roles.

| Role | Email | Password |
|---|---|---|
| Customer | customer@homease.com | password |
| Provider | arjun@homease.com | password |
| Provider | kavitha@homease.com | password |
| Admin | admin@homease.com | admin123 |

---

## 🗂️ Project Structure

```text
HomeEase/
│
├── public/
│   └── index.html
│
├── src/
│   │
│   ├── App.js
│   ├── index.js
│   ├── index.css
│   │
│   ├── context/
│   │   └── AppContext.js
│   │
│   ├── data/
│   │   └── mockData.js
│   │
│   ├── pages/
│   │   └── AuthPages.js
│   │
│   └── components/
│       │
│       ├── shared/
│       │   └── Shared.js
│       │
│       ├── customer/
│       │   ├── CustomerHome.js
│       │   ├── ProviderProfile.js
│       │   ├── CustomerBookings.js
│       │   └── CustomerProfile.js
│       │
│       ├── provider/
│       │   └── ProviderPages.js
│       │
│       ├── chat/
│       │   └── ChatPage.js
│       │
│       └── admin/
│           └── AdminPanel.js
│
└── package.json
```

---

## ✨ Features Implemented

### 1. 🔐 Authentication System

- Login and Signup functionality.
- Role selection (Customer / Provider).
- Session persistence using localStorage.
- Role-based route protection.
- Automatic redirects based on user roles.

### 2. 👤 Customer Module

- Browse household service categories:
  - Plumbing
  - Electrical
  - Cleaning
  - Carpentry
  - Painting
  - Appliance Repair
- Search providers by name, service, or location.
- Filter providers by rating, price, and location.
- View provider profiles, portfolios, reviews, and availability.
- Book services by selecting date, time, and address.
- Track booking status:
  - Requested
  - Accepted
  - Completed
- Submit reviews after completed bookings.

### 3. 🛠️ Provider Module

- Dedicated provider dashboard.
- View booking statistics:
  - Pending bookings
  - Active bookings
  - Completed bookings
  - Total earnings
- Accept or reject booking requests.
- Mark bookings as completed.
- Edit provider profile, including bio, pricing, category, and location.
- View and respond to customer bookings.

### 4. 💬 Chat System

- Real-time-like messaging between customers and providers.
- Messages persist using localStorage.
- Display message timestamps.
- Differentiate sender and receiver messages.
- Automatic scrolling to the latest message.
- Quick reply suggestions.

### 5. 🔔 Notification System

- Notification bell with unread count.
- Booking request notifications.
- Booking acceptance and rejection notifications.
- Booking completion notifications.
- New message notifications.
- Read/unread notification management.
- Dropdown notification history.

### 6. 🤖 Smart Recommendations

- Recommends providers based on previous searches.
- Uses booking history to improve recommendations.
- Falls back to top-rated providers when history is unavailable.

### 7. 🛡️ Admin Panel

- Dashboard with platform statistics.
- Category-wise breakdown.
- Manage all service providers.
- Verify or unverify providers.
- View registered customers.
- Monitor all bookings and their statuses.

### 8. 💾 Data Persistence

- User information stored in localStorage.
- Booking information persists across refreshes.
- Chat messages are saved locally.
- Notifications maintain read/unread status.
- Application data persists across page refreshes.

---

## 🎨 Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18 |
| Programming Language | JavaScript |
| Routing | React Router v6 |
| State Management | Context API |
| Data Persistence | Browser localStorage |
| Styling | Pure CSS |
| Icons | Unicode Emojis |
| Fonts | Fraunces, Plus Jakarta Sans |
| Images | Unsplash |

---

## 📊 Sample Data

The application includes pre-loaded demonstration data:

- **6 Service Providers** – One for each service category, with ratings, reviews, portfolios, and availability.
- **1 Demo Customer** – Includes previous bookings and search history.
- **Sample Bookings** – Bookings in different statuses.
- **Chat Messages** – Pre-loaded conversations for demonstration.
- **Notifications** – Sample read and unread notifications.

---

## 🔮 Future Enhancements

The current application uses mock data and localStorage for demonstration purposes.

The following improvements can be implemented for a production-ready application:

1. Develop a Node.js and Express backend.
2. Integrate MongoDB, MySQL, or PostgreSQL.
3. Replace localStorage with REST API integration.
4. Implement JWT-based authentication.
5. Add secure password hashing.
6. Integrate real-time communication using WebSockets.
7. Implement online payment integration.
8. Add real-time booking and provider availability updates.

---

## 🎯 Project Information

| Detail | Description |
|---|---|
| Project Name | HomeEase |
| Project Type | DBMS Project |
| Application Type | Household Services Marketplace |
| Frontend | React.js |
| Version | 1.0 |
| Inspiration | Urban Company |

---

## 👨‍💻 Developed By

**Ramachandrappa Neelegar**

GitHub: [ramneelegar](https://github.com/ramneelegar)

---

⭐ If you find this project interesting, consider giving the repository a star!
