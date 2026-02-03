# Frontend Development Guide

## 🎯 Project Overview

Optivo Frontend is a modern, scalable web application built with Next.js 15, React 18, and follows enterprise-grade architectural patterns used by top MNCs.

## ✨ Key Features

- ✅ Enterprise-grade architecture and code organization
- ✅ Modular and scalable component structure
- ✅ Centralized service layer for API calls
- ✅ Custom React hooks for state management
- ✅ Comprehensive utility functions
- ✅ Global constants and configuration
- ✅ Production-ready error handling
- ✅ Fully responsive design (mobile-first approach)
- ✅ Authentication system with mock support
- ✅ Expense tracker with real-time updates

## 🏗️ Architecture

The project follows a **Clean Architecture** pattern with clear separation of concerns:

```
Presentation Layer (Components)
         ↓
State Management Layer (Hooks)
         ↓
Business Logic Layer (Services)
         ↓
Data Access Layer (APIClient)
         ↓
External APIs & Storage
```

## 📂 Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed folder structure and organization.

### Quick Overview:
```
src/
├── components/       # UI components (common, features, layout)
├── pages/           # Next.js app router pages
├── services/        # API calls & business logic
├── hooks/           # Custom React hooks
├── utils/           # Helper & utility functions
├── constants/       # Global constants
├── config/          # Configuration files
└── types/           # TypeScript types (future)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. Start development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in browser

## 📚 Services Guide

### AuthService
```javascript
import { AuthService } from '@/services';

// Login
await AuthService.login(email, password);

// Signup
await AuthService.signup(userData);

// Logout
await AuthService.logout();

// Get current user
AuthService.getCurrentUser();

// Check auth
AuthService.checkAuth();
```

### ExpenseService
```javascript
import { ExpenseService } from '@/services';

// Get all expenses
await ExpenseService.getExpenses();

// Create expense
await ExpenseService.createExpense(expenseData);

// Get expense
await ExpenseService.getExpense(id);

// Update expense
await ExpenseService.updateExpense(id, expenseData);

// Delete expense
await ExpenseService.deleteExpense(id);

// Get summary
await ExpenseService.getExpenseSummary();
```

## 🪝 Hooks Guide

### useAuth Hook
```javascript
import { useAuth } from '@/hooks';

export function MyComponent() {
    const { user, isAuthenticated, isLoading, login, logout } = useAuth();
    
    // Use in component
    if (isLoading) return <LoadingSpinner />;
    if (!isAuthenticated) return <LoginForm onLogin={login} />;
    
    return <Dashboard user={user} onLogout={logout} />;
}
```

### useFetch Hook
```javascript
import { useFetch } from '@/hooks';
import { ExpenseService } from '@/services';

export function ExpenseList() {
    const { data, isLoading, error, refetch } = useFetch(
        () => ExpenseService.getExpenses(),
        [] // dependencies
    );
    
    if (isLoading) return <Loading />;
    if (error) return <Error message={error} />;
    
    return (
        <>
            {data.map(expense => <ExpenseItem key={expense.id} {...expense} />)}
            <button onClick={refetch}>Refresh</button>
        </>
    );
}
```

## 🛠️ Utils Guide

### Validators
```javascript
import { validateEmail, validatePassword, validateAmount } from '@/utils';

const emailResult = validateEmail('user@example.com');
if (!emailResult.isValid) {
    console.log(emailResult.error);
}

const passwordResult = validatePassword('MyPassword@123');
console.log(passwordResult.requirements); // {minLength: true, ...}
```

### Formatters
```javascript
import { 
    formatCurrency, 
    formatDate, 
    formatTime,
    formatRelativeTime 
} from '@/utils';

formatCurrency(1000);              // ₹1,000.00
formatDate('2026-02-03');         // Feb 03, 2026
formatTime('2026-02-03T14:30:00'); // 14:30
formatRelativeTime(pastDate);      // 2 hours ago
```

## ⚙️ Configuration

### App Configuration (`src/config/app.config.js`)
```javascript
{
    API: { BASE_URL, TIMEOUT, RETRY_ATTEMPTS },
    AUTH: { TOKEN_KEY, ENABLE_MOCK_AUTH },
    VALIDATION: { PASSWORD_MIN_LENGTH, EMAIL_REGEX },
    BUDGET: { DEFAULT_MONTHLY_BUDGET, CURRENCY }
}
```

### API Endpoints (`src/config/api.endpoints.js`)
All API endpoints are centrally defined here. Update this file when backend API changes.

## 📋 Constants

All magic strings are stored in `/constants`:
- `EXPENSE_CATEGORIES` - Category definitions with icons
- `DASHBOARD_TABS` - Tab configurations
- `ROUTES` - Route definitions
- `ERROR_MESSAGES` - Error message strings
- `SUCCESS_MESSAGES` - Success message strings

## 🔐 Authentication

### Development Mode
Use mock authentication for development:

```javascript
import { AuthService } from '@/services';

// Create mock token
AuthService.createMockToken(); // Creates demo user

// Login with credentials (requires backend)
AuthService.login('user@example.com', 'password');
```

### Production Mode
- Remove mock tokens
- Implement proper token refresh
- Use httpOnly cookies for tokens

## 🎨 Components

### Common Components (`src/components/common/`)
Reusable UI components used across features:
- Button
- Input
- Card
- Modal
- etc.

### Feature Components (`src/components/features/`)
Feature-specific components:
- ExpenseTracker
- Dashboard
- AuthForms
- etc.

### Layout Components (`src/components/layout/`)
Layout wrapper components:
- Header
- Sidebar
- Footer
- etc.

## 📱 Responsive Design

All components use CSS Modules with responsive breakpoints:
- Mobile: < 480px
- Tablet: 481px - 768px
- Tablet Large: 769px - 1024px
- Desktop: > 1024px

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Test Structure
- Unit tests for services
- Integration tests for hooks
- Component tests with React Testing Library

## 📦 Build

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Analyze Build
```bash
npm run analyze
```

## 🔍 Debugging

### Enable Debug Logging
```javascript
import logger from '@/services/logger.service';

logger.debug('MyComponent', 'Debug message', { data });
logger.info('MyComponent', 'Info message');
logger.warn('MyComponent', 'Warning message');
logger.error('MyComponent', 'Error message', error);
```

## 🚨 Error Handling

All API calls return standardized response:
```javascript
{
    success: true/false,
    data: {...},        // When success
    error: "message",   // When error
    status: 200/400/500
}
```

Always check `response.success` before using `response.data`.

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Architecture Guide](./ARCHITECTURE.md)
- [API Documentation](../BACKEND.md)

## 🤝 Contributing

1. Follow project structure strictly
2. Use services for API calls
3. Create custom hooks for state logic
4. Add proper error handling
5. Document your code
6. Write tests for new features

## 📝 Git Workflow

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes following architecture
3. Commit with descriptive messages
4. Push and create pull request
5. Get code review before merging

## 🎯 Future Improvements

- [ ] Add TypeScript support
- [ ] Implement error boundary component
- [ ] Add Sentry integration
- [ ] Setup E2E testing with Cypress
- [ ] Implement service worker for offline
- [ ] Add lighthouse CI checks
- [ ] Implement feature flags system
- [ ] Add analytics integration

## 📞 Support

For issues or questions:
1. Check ARCHITECTURE.md
2. Review relevant service/hook code
3. Check existing issues
4. Create new issue with details

---

**Last Updated**: February 2026
**Next.js Version**: 15.5.2
**React Version**: 18+
