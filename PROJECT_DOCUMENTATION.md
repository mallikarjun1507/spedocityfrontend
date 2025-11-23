# Spedocity Project Documentation

## Project Overview
Spedocity is a full-stack delivery management application built with React and Node.js, designed to handle logistics and transportation operations in Karnataka, India.

---

## Table of Contents
1. [Architecture](#architecture)
2. [Backend (spedocityApi)](#backend-spedocityapi)
3. [Frontend (spedocityfrontend)](#frontend-spedocityfrontend)
4. [Database Schema](#database-schema)
5. [Installation & Setup](#installation--setup)
6. [API Endpoints](#api-endpoints)
7. [Features](#features)
8. [Development Guidelines](#development-guidelines)

---

## Architecture

### Tech Stack

**Backend:**
- Node.js with Express.js v5.1.0
- MySQL2 v3.15.0 for database
- JWT for authentication
- Twilio for SMS/OTP services
- Winston for logging

**Frontend:**
- React v18.3.1 with Vite v6.3.5
- TypeScript
- Tailwind CSS for styling
- Radix UI for component library
- React Router v7.9.1 for navigation
- Axios for HTTP requests
- Framer Motion for animations

---

## Backend (spedocityApi)

### Project Structure
```
spedocityApi/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   └── user/
│       └── userAuthentication.js
├── middleware/
│   └── authMiddleware.js
├── routes/
│   └── userRoutes/
│       └── userAuthRoute.js
├── utils/
│   ├── logger.js          # Winston logging setup
│   └── requestLogger.js   # Request logging middleware
├── logs/                  # Application logs
├── server.js              # Main server file
├── package.json
└── README.md
```

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^5.1.0 | Web framework |
| mysql2 | ^3.15.0 | Database driver |
| jsonwebtoken | ^9.0.2 | JWT authentication |
| bcryptjs | ^3.0.2 | Password hashing |
| twilio | ^5.10.0 | SMS/OTP services |
| winston | ^3.17.0 | Logging |
| helmet | ^8.1.0 | Security headers |
| cors | ^2.8.5 | Cross-origin requests |
| express-rate-limit | ^8.1.0 | Rate limiting |
| morgan | ^1.10.1 | HTTP request logging |

### Running the Backend

```bash
cd spedocityApi
npm install
npm start
```

The server will start on the configured port (check `.env` file).

---

## Frontend (spedocityfrontend)

### Project Structure
```
spedocityfrontend/
├── src/
│   ├── components/
│   │   ├── booking/          # Booking flow components
│   │   │   ├── PickupSelection.tsx
│   │   │   ├── DropLocation.tsx
│   │   │   ├── ServiceSelection.tsx
│   │   │   ├── ItemDetails.tsx
│   │   │   ├── HelperOption.tsx
│   │   │   ├── Schedule.tsx
│   │   │   ├── FareEstimate.tsx
│   │   │   ├── ConfirmBooking.tsx
│   │   │   ├── PaymentPage.tsx
│   │   │   ├── OtpConfirmation.tsx
│   │   │   └── TrackDelivery.tsx
│   │   ├── ActiveOrder.tsx
│   │   ├── Dashboard.tsx
│   │   ├── LoginSignup.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── WalletScreen.tsx
│   │   ├── OrdersScreen.tsx
│   │   ├── NotificationScreen.tsx
│   │   ├── BottomNavigation.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ui/               # shadcn/ui components
│   ├── contexts/
│   │   └── AuthContext.tsx   # Authentication context
│   ├── api/
│   │   └── axiosInstance.ts  # Axios configuration
│   ├── utils/
│   │   └── utils.tsx
│   ├── styles/
│   │   └── globals.css       # Global Tailwind CSS
│   ├── App.tsx
│   └── main.tsx
├── vite.config.js
├── package.json
└── build/                    # Production build output
```

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3.1 | UI framework |
| react-router-dom | ^7.9.1 | Client-side routing |
| axios | ^1.12.2 | HTTP client |
| react-hook-form | ^7.55.0 | Form handling |
| @react-google-maps/api | ^2.20.7 | Google Maps integration |
| framer-motion | ^12.23.21 | Animations |
| recharts | ^2.15.2 | Data visualization |
| react-toastify | ^11.0.5 | Toast notifications |
| sonner | ^2.0.3 | Notifications |
| @radix-ui/* | Latest | Component library |
| tailwindcss | Latest | Utility-first CSS |
| date-fns | ^3.3.1 | Date utilities |

### Running the Frontend

```bash
cd spedocityfrontend
npm install
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

Development server runs on `http://localhost:5173`

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    user_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    mobile_number VARCHAR(15) NOT NULL UNIQUE,
    country_code VARCHAR(5) DEFAULT '+91',
    is_verified TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### OTPs Table
```sql
CREATE TABLE otps (
    otp_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    is_used TINYINT(1) DEFAULT 0,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### User Info Table
```sql
CREATE TABLE user_info (
    info_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    full_name VARCHAR(150),
    email VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### User Address Table
```sql
CREATE TABLE user_address (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    longitude VARCHAR(100),
    latitude VARCHAR(100),
    user_address VARCHAR(2000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### Karnataka Table
```sql
CREATE TABLE karnataka (
    karnataka_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    taluk_name VARCHAR(100),
    hobai_name VARCHAR(100),
    pin_code BIGINT UNSIGNED NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### Blacklisted Tokens Table
```sql
CREATE TABLE blacklisted_tokens (
    token_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Database Maintenance

**Automated Events:**
- **Monthly Archiving:** OTP records older than 30 days are archived to `otps_archive` table
- **Daily Cleanup:** Expired OTPs and tokens are automatically deleted

---

## Installation & Setup

### Prerequisites
- Node.js v16+ and npm
- MySQL v8+
- Git

### Backend Setup

1. **Clone and install dependencies:**
   ```bash
   cd spedocityApi
   npm install
   ```

2. **Configure environment:**
   Create `.env` file in `spedocityApi/`:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=spedocity
   JWT_SECRET=your_jwt_secret
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   PORT=5000
   ```

3. **Setup database:**
   ```bash
   mysql -u root -p < sqlscri.sql
   ```

4. **Start server:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd spedocityfrontend
   npm install
   ```

2. **Configure API endpoint:**
   Update `src/api/axiosInstance.ts` with backend URL

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user with mobile number
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/address` - Get user address
- `POST /api/user/address` - Save user address

### Bookings
- `POST /api/booking/create` - Create new booking
- `GET /api/booking/list` - Get user bookings
- `GET /api/booking/:id` - Get booking details
- `PUT /api/booking/:id/cancel` - Cancel booking

### Tracking
- `GET /api/tracking/:booking_id` - Get real-time tracking

---

## Features

### User Authentication
- Mobile number based registration
- OTP verification via Twilio
- JWT token-based authentication
- Secure password hashing with bcryptjs
- Token blacklisting for logout

### Booking System
- Multiple pickup/drop location selection
- Service type selection (Mini Truck, Auto, etc.)
- Item details and quantity management
- Helper option selection
- Fare estimation
- Payment gateway integration
- Real-time delivery tracking

### User Management
- Profile creation and editing
- Address management with geolocation
- Wallet functionality
- Order history
- Notifications

### Security
- CORS protection
- Helmet.js security headers
- Rate limiting on API endpoints
- JWT token validation
- Input validation and sanitization

---

## Development Guidelines

### Code Organization
- **Components:** Reusable UI components in `src/components/`
- **Contexts:** Global state management in `src/contexts/`
- **Utils:** Helper functions in `src/utils/`
- **API:** HTTP requests via Axios instance
- **Styles:** Tailwind CSS with global styles

### Component Structure
- Functional components with hooks
- Props-based data flow
- Context API for global state
- Error boundaries for error handling

### Naming Conventions
- **Components:** PascalCase (e.g., `PickupSelection.tsx`)
- **Functions/Variables:** camelCase (e.g., `fetchUserData`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **CSS Classes:** kebab-case (Tailwind conventions)

### Git Workflow
- Current branch: `akhilesh`
- Feature branches: `feature/feature-name`
- Commit messages: Descriptive and concise
- Pull requests required for merging

### TypeScript
- Strict mode enabled
- Type annotations for all functions
- Interface/Type definitions for data models
- Avoid `any` type usage

### Performance Best Practices
- Code splitting with React Router
- Lazy loading for components
- Image optimization
- API request debouncing/throttling
- Minimize re-renders with memoization

---

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check credentials in `.env` file
- Ensure database `spedocity` exists

### API Connection Issues
- Check backend is running on correct port
- Verify API URL in `axiosInstance.ts`
- Check CORS configuration

### Build Issues
- Clear `node_modules` and reinstall: `npm install`
- Clear build cache: `rm -rf dist/`
- Check Node version compatibility

---

## Support & References
- **Frontend Repository:** https://github.com/mallikarjun1507/spedocityfrontend
- **Backend Repository:** https://github.com/madhukumarap/spedocityApi
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev
- **Express Docs:** https://expressjs.com
- **Tailwind CSS:** https://tailwindcss.com

---

**Last Updated:** November 23, 2025
**Current Branch:** akhilesh
**Version:** 1.0.0
