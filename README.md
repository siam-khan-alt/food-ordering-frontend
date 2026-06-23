# 🍕 BiteBox — Food Ordering System

A full-stack food ordering web application built with the MERN stack, featuring customer ordering flow with PayHere Sandbox payment integration and a complete admin management panel.

**Live Demo:** [https://bitebox-ashy.vercel.app/]
**Demo Video:** [Video]

---

## 📋 Overview

BiteBox is a food delivery platform where customers can browse a dynamic menu, add items to their cart, and complete secure payments via PayHere Sandbox. Admins have full control over food inventory and order management through a dedicated dashboard.

---

## ✨ Features

### Customer
- Register and Login with JWT-based authentication
- Browse food items with search, category filter, and price sorting
- Add items to cart (persisted via Context + localStorage)
- Secure checkout and payment via **PayHere Sandbox**
- View order confirmation after successful payment
- Track order history and payment status in "My Orders"

### Admin
- Secure admin login with role-based access control
- Dashboard with order/revenue/inventory stats overview
- Add, edit, and delete food items (with dynamic category selector)
- View all customer orders with payment status
- View detailed customer information and order history per customer
- Update order status (Placed → Preparing → Delivered / Cancelled)

### General
- Fully responsive UI (mobile, tablet, desktop)
- Dark/Light theme toggle
- Toast notifications for all key actions
- Custom-built reusable UI components (no default browser dropdowns/alerts)

---

## 🛠️ Tech Stack

**Frontend**
- React.js (Vite)
- React Router DOM
- Tailwind CSS v4
- Axios
- Lucide React (icons)
- React Hot Toast

**Backend**
- Node.js + Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt.js for password hashing
- PayHere Sandbox API (payment gateway)

---

## 📁 Project Structure

```
food-ordering/
├── food-ordering-backend/
│   ├── config/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── foodController.js
│   │   ├── orderController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── FoodItem.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── foodRoutes.js
│   │   ├── orderRoutes.js
│   │   └── paymentRoutes.js
│   ├── .env.local
│   └── server.js
│
└── food-ordering-frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── components/
    │   │   ├── common/       (Button, Input, Modal, CustomSelect, Toast)
    │   │   ├── layout/       (Navbar, Footer)
    │   │   ├── home/         (Hero, FeaturedFoods, HowItWorks, etc.)
    │   │   ├── food/         (FoodCard)
    │   │   ├── cart/         (CartItem, CartSummary)
    │   │   └── admin/        (AdminSidebar, CategorySelector, CustomerDetailsModal)
    │   ├── context/
    │   │   ├── AuthContext.jsx / AuthProvider.jsx
    │   │   ├── ThemeContext.jsx / ThemeProvider.jsx
    │   │   └── CartContext.jsx / CartProvider.jsx
    │   ├── pages/
    │   │   ├── Home.jsx, Login.jsx, Register.jsx, Menu.jsx
    │   │   ├── Cart.jsx, Checkout.jsx, OrderConfirmation.jsx, MyOrders.jsx
    │   │   └── admin/  (AdminDashboard, AdminHome, ManageFoods, ManageOrders)
    │   ├── routes/
    │   │   └── ProtectedRoute.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── index.html
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- PayHere Sandbox account ([sandbox.payhere.lk](https://sandbox.payhere.lk))

### 1. Clone the repository
```bash
git clone https://github.com/siam-khan-alt/food-ordering-frontend
cd food-ordering-frontend
git clone https://github.com/siam-khan-alt/food-ordering-backend
cd food-ordering-backend
```

### 2. Backend Setup
```bash
cd food-ordering-backend
npm install
```

Create a `.env.local` file in the backend root:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PAYHERE_MERCHANT_ID=your_payhere_merchant_id
PAYHERE_MERCHANT_SECRET=your_payhere_merchant_secret
```

Run the backend:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd food-ordering-frontend
npm install
```

Create a `.env` file in the frontend root:
```env
VITE_BACKEND_URL=http://localhost:5000
```

Run the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔑 Demo Credentials

| Role     | Email              | Password   |
|----------|---------------------|------------|
| Customer | siam@test.com       | 123456     |
| Admin    | admin@test.com      | admin123   |

*(Quick-login buttons are also available on the Login page)*

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint             | Access | Description         |
|--------|------------------------|--------|----------------------|
| POST   | /api/auth/register     | Public | Register new user   |
| POST   | /api/auth/login        | Public | Login user           |

### Food
| Method | Endpoint               | Access       | Description           |
|--------|--------------------------|--------------|------------------------|
| GET    | /api/food/all            | Public       | Get all food items    |
| POST   | /api/food/add            | Admin only   | Add new food item     |
| PATCH  | /api/food/update/:id     | Admin only   | Update food item      |
| DELETE | /api/food/delete/:id     | Admin only   | Delete food item      |

### Order
| Method | Endpoint                       | Access         | Description                  |
|--------|----------------------------------|----------------|-------------------------------|
| POST   | /api/order/create                | Authenticated  | Create new order             |
| GET    | /api/order/myOrder                | Authenticated  | Get logged-in user's orders  |
| GET    | /api/order/single/:orderId        | Authenticated  | Get a single order           |
| GET    | /api/order/allOrder               | Admin only     | Get all orders                |
| GET    | /api/order/customer/:customerId   | Admin only     | Get a customer's full history|
| PATCH  | /api/order/status/:orderId        | Admin only     | Update order status          |

### Payment
| Method | Endpoint                     | Access         | Description                      |
|--------|---------------------------------|----------------|------------------------------------|
| POST   | /api/payment/generate-hash      | Authenticated  | Generate PayHere security hash   |
| POST   | /api/payment/notify             | Public (webhook) | PayHere payment status callback |

---

## 🔐 Security Implementation

- Passwords hashed using **bcrypt** (10 salt rounds)
- **JWT** based authentication with 7-day expiry
- Role-based middleware (`verifyToken`, `isAdmin`) protecting sensitive routes
- Server-side price calculation (never trusts client-sent prices) to prevent payment manipulation
- PayHere webhook signature verification (MD5 hash comparison) to prevent forged payment notifications
- MongoDB transactions used for cascade delete operations to maintain data consistency

---

## 🧪 Testing Notes

This project was built incrementally with manual testing at each step using Thunder Client/Postman for backend endpoints, and direct browser testing for the full customer and admin user flows (Register → Login → Browse → Cart → Checkout → Payment → Order Confirmation → My Orders, and the parallel Admin flow).

---

## 👤 Author

**Md Siam Khan**
Full Stack Developer
📧 nssiam99@gmail.com
🔗 [Portfolio](https://siamkhan-portfolio.vercel.app/) | [LinkedIn](https://www.linkedin.com/in/siam-khan-sp99/) | [GitHub](https://github.com/siam-khan-alt)

---

## 📄 License

This project was developed as part of an internship technical assignment.