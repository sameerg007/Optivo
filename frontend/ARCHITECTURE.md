# Frontend Project Structure Documentation

## 📁 Directory Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/              # Reusable components (Button, Input, Card, etc.)
│   │   ├── features/            # Feature-specific components (Auth, Dashboard, etc.)
│   │   └── layout/              # Layout components (Header, Sidebar, Footer, etc.)
│   │
│   ├── pages/                   # Next.js App Router pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── dashboard/
│   │   └── ...
│   │
│   ├── services/                # Business logic & API calls
│   │   ├── api/
│   │   │   ├── api.client.js   # HTTP client with interceptors
│   │   │   ├── expense.service.js
│   │   │   └── ...
│   │   ├── auth/
│   │   │   └── auth.service.js # Authentication logic
│   │   ├── storage/
│   │   │   └── storage.service.js # LocalStorage wrapper
│   │   ├── logger.service.js
│   │   └── index.js
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.js          # Authentication hook
│   │   ├── useFetch.js         # Data fetching hook
│   │   └── index.js
│   │
│   ├── utils/                   # Utility functions
│   │   ├── validators.js       # Form & data validators
│   │   ├── formatters.js       # Data formatting helpers
│   │   └── index.js
│   │
│   ├── constants/               # Global constants
│   │   └── index.js            # Categories, routes, messages, etc.
│   │
│   ├── config/                  # Configuration files
│   │   ├── app.config.js       # App configuration
│   │   ├── api.endpoints.js    # API endpoints
│   │   └── index.js
│   │
│   ├── types/                   # TypeScript types & interfaces (future)
│   │   └── index.ts
│   │
│   └── styles/                  # Global styles
│       ├── globals.css
│       └── variables.css
│
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── next.config.ts
├── tsconfig.json
└── package.json
```

## 🏗️ Architecture Overview

### Services Layer
- **APIClient** - HTTP requests with timeout, retry, and auth
- **AuthService** - User login, signup, logout, token management
- **ExpenseService** - Expense CRUD operations
- **StorageService** - Safe localStorage operations
- **Logger** - Centralized logging

### Custom Hooks
- **useAuth** - Auth state management
- **useFetch** - Generic data fetching with loading/error states

### Utilities
- **Validators** - Email, password, amount, phone validation
- **Formatters** - Date, time, currency, number formatting

### Constants
- Expense categories with icons and colors
- Dashboard tabs configuration
- HTTP status codes
- Error and success messages
- Route definitions
- Storage keys

### Configuration
- App settings (API, Auth, Features, UI, Validation, Budget)
- API endpoints definitions

## 🚀 Usage Examples

### Import Services
```javascript
import { AuthService, ExpenseService, Logger } from '@/services';
import APIClient from '@/services/api/api.client';
```

### Import Hooks
```javascript
import { useAuth, useFetch } from '@/hooks';
```

### Import Utils
```javascript
import { 
  validateEmail, 
  validatePassword,
  formatCurrency, 
  formatDate 
} from '@/utils';
```

### Import Constants & Config
```javascript
import { EXPENSE_CATEGORIES, DASHBOARD_TABS, ROUTES } from '@/constants';
import { APP_CONFIG, API_ENDPOINTS } from '@/config';
```

## 📋 Naming Conventions

- **Components**: PascalCase (e.g., `LoginForm.js`)
- **Services**: camelCase with `.service.js` suffix (e.g., `auth.service.js`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.js`)
- **Utils**: camelCase (e.g., `validators.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `EXPENSE_CATEGORIES`)
- **CSS Modules**: camelCase with `.module.css` suffix

## 🔒 Best Practices

1. **Always use services for API calls** - Never call fetch directly
2. **Use hooks for state management** - Centralize logic in custom hooks
3. **Validate data on both ends** - Client and server validation
4. **Use constants for magic strings** - No hardcoded values
5. **Log important operations** - Use Logger service consistently
6. **Handle errors gracefully** - Provide meaningful error messages
7. **Keep components focused** - Single responsibility principle
8. **Reuse components** - Use common components from `/components/common/`

## 🔄 Data Flow

```
Component
  ↓
Hook (useAuth, useFetch)
  ↓
Service (AuthService, ExpenseService)
  ↓
APIClient
  ↓
Backend API
```

## 📦 Adding New Features

1. Create services in `/services/api/` for API calls
2. Create custom hooks in `/hooks/` for state management
3. Create components in `/components/features/` for UI
4. Add constants in `/constants/index.js`
5. Add API endpoints in `/config/api.endpoints.js`
6. Use validators and formatters from `/utils/`

## 🧪 Testing Strategy

- Test services independently with mock API calls
- Test hooks with mock services
- Test components with mock hooks
- Use integration tests for complete flows

## 📝 Documentation

- Add JSDoc comments to all functions
- Document function parameters and return values
- Keep this README updated with architectural changes
