# Frontend Architecture Documentation

## 📁 Directory Structure

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router (Pages)
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.js              # Home page
│   │   ├── globals.css          # Global styles
│   │   ├── login/
│   │   │   ├── page.js          # Login page
│   │   │   └── login.module.css
│   │   ├── signup/
│   │   │   ├── page.js          # Signup page
│   │   │   └── signUp.module.css
│   │   ├── forgot-password/
│   │   │   ├── page.js          # Forgot password page
│   │   │   └── forgotPassword.module.css
│   │   └── dashboard/
│   │       └── page.js          # Dashboard page
│   │
│   ├── components/
│   │   ├── common/              # Reusable UI components
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   └── index.js
│   │   │
│   │   ├── features/            # Feature-specific components
│   │   │   ├── expense-tracker/ # ExpenseTracker feature
│   │   │   │   ├── ExpenseTracker.js
│   │   │   │   ├── AddExpenseModal.js
│   │   │   │   ├── CategoryBreakdown.js
│   │   │   │   ├── SummaryCard.js
│   │   │   │   ├── config.js
│   │   │   │   └── *.module.css
│   │   │   ├── dashboard/       # Dashboard feature
│   │   │   │   ├── TabContent.js
│   │   │   │   ├── TabNavigation.js
│   │   │   │   └── dashboard.module.css
│   │   │   └── index.js
│   │   │
│   │   ├── layout/              # Layout components
│   │   │   ├── Header/
│   │   │   └── index.js
│   │   │
│   │   ├── charts/              # Chart components
│   │   │   ├── AreaChart/
│   │   │   ├── BarChart/
│   │   │   ├── DonutChart/
│   │   │   ├── LineChart/
│   │   │   ├── PieChart/
│   │   │   └── index.js
│   │   │
│   │   └── index.js             # Central component exports
│   │
│   ├── services/                # Business logic & API calls
│   │   ├── api/
│   │   │   ├── api.client.js    # HTTP client with interceptors
│   │   │   └── expense.service.js
│   │   ├── auth/
│   │   │   └── auth.service.js  # Authentication logic
│   │   ├── storage/
│   │   │   └── storage.service.js
│   │   ├── logger.service.js
│   │   └── index.js
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.js           # Authentication hook
│   │   ├── useFetch.js          # Data fetching hook
│   │   └── index.js
│   │
│   ├── utils/                   # Utility functions
│   │   ├── validators.js        # Form & data validators
│   │   ├── formatters.js        # Data formatting helpers
│   │   └── index.js
│   │
│   ├── constants/               # Global constants
│   │   └── index.js
│   │
│   ├── config/                  # Configuration files
│   │   ├── app.config.js
│   │   ├── api.endpoints.js
│   │   ├── dashboard.config.js
│   │   └── index.js
│   │
│   ├── types/                   # TypeScript types (future)
│   │   └── index.ts
│   │
│   └── styles/                  # Global styles
│
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── next.config.ts
├── tsconfig.json
└── package.json
```

## 🏗️ Architecture Principles

### 1. Single Routing Approach
- **App Router ONLY** - Using Next.js 13+ App Router (`src/app/`)
- No legacy Pages Router to avoid conflicts

### 2. Component Organization
- **common/** - Reusable UI primitives (Button, Input, Card)
- **features/** - Feature-specific components grouped by domain
- **layout/** - Page structure components (Header, Footer, Sidebar)
- **charts/** - Data visualization components

### 3. Services Layer
- **AuthService** - Authentication, token management
- **APIClient** - HTTP requests with interceptors
- **StorageService** - Safe localStorage operations
- **Logger** - Centralized logging

### 4. Import Aliases
Using `@/*` path alias for clean imports:
```javascript
import { AuthService, Logger } from '@/services';
import { Button, Card } from '@/components/common';
import { validateEmail } from '@/utils/validators';
```

## 📦 Import Patterns

### Services
```javascript
import { AuthService, Logger, StorageService } from '@/services';
```

### Components
```javascript
// Common components
import { Button, Input, Card } from '@/components/common';

// Layout components
import { Header } from '@/components/layout';

// Feature components (direct import)
import ExpenseTracker from '@/components/features/expense-tracker/ExpenseTracker';
```

### Config
```javascript
import { TAB_CONTENT, DEFAULT_ACTIVE_TAB } from '@/config/dashboard.config';
import { API_ENDPOINTS } from '@/config';
```

### Hooks
```javascript
import { useAuth } from '@/hooks';
```

### Utils
```javascript
import { validateEmail, validatePassword } from '@/utils/validators';
import { formatCurrency, formatDate } from '@/utils/formatters';
```

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        App Router                           │
│                     (src/app/*/page.js)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Feature Components                        │
│              (src/components/features/*)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
┌───────────────────────┐   ┌───────────────────────┐
│    Common Components  │   │       Services        │
│  (Button, Input, etc) │   │  (Auth, API, Logger)  │
└───────────────────────┘   └───────────────────────┘
                                      │
                                      ▼
                            ┌───────────────────────┐
                            │    Storage Service    │
                            │    (localStorage)     │
                            └───────────────────────┘
```

## 🔐 Authentication Flow

1. User navigates to protected route (`/dashboard`)
2. `DashboardPage` checks auth token via `AuthService.getAuthToken()`
3. If no token:
   - Development: Creates mock token
   - Production: Redirects to `/login`
4. Login stores token via `AuthService.setAuthToken()`
5. Logout clears tokens via `AuthService.logout()`

## 📝 Best Practices

1. **Use path aliases** - Always use `@/` imports
2. **Export from index** - Services, hooks, and components export from index.js
3. **Feature isolation** - Keep feature-specific code within feature folders
4. **CSS Modules** - Use `.module.css` for component-scoped styles
5. **Server/Client components** - Mark client components with `'use client'`
