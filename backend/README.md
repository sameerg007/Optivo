# Optivo Backend Microservice

Express.js backend microservice for SMS parsing and transaction management.

## Features

- **SMS Parsing**: Extracts transaction data from Indian bank SMS messages
- **Transaction Management**: CRUD operations for transactions
- **Category Detection**: Auto-categorizes expenses based on merchant names
- **Duplicate Detection**: Prevents duplicate transactions from the same SMS

## Supported Banks

The SMS parser supports messages from major Indian banks including:
- HDFC, ICICI, SBI, Axis, Kotak, PNB
- Yes Bank, IndusInd, RBL, Federal, Bandhan
- IDBI, Canara, Union Bank, BOB, BOI
- Citi, HSBC, Standard Chartered, AMEX

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=3001
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,capacitor://localhost
```

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Health Check

```
GET /api/health
```

### SMS Parsing

**Parse single SMS:**
```
POST /api/sms/parse
Content-Type: application/json

{
  "message": "Your A/c XX1234 is debited for Rs.500.00 on 15-Jan-24 at AMAZON",
  "deviceId": "device_123"
}
```

**Parse multiple SMS:**
```
POST /api/sms/batch
Content-Type: application/json

{
  "messages": [
    { "body": "SMS text 1", "sender": "HDFC", "timestamp": 1234567890 },
    { "body": "SMS text 2", "sender": "ICICI", "timestamp": 1234567891 }
  ],
  "deviceId": "device_123"
}
```

**Validate SMS format:**
```
POST /api/sms/validate
Content-Type: application/json

{
  "message": "Your SMS text here"
}
```

### Transactions

**Get all transactions:**
```
GET /api/transactions?deviceId=device_123
```

**Get transaction summary:**
```
GET /api/transactions/summary?deviceId=device_123
```

**Add transaction:**
```
POST /api/transactions
Content-Type: application/json

{
  "deviceId": "device_123",
  "type": "debit",
  "amount": 500,
  "merchant": "Amazon",
  "category": "shopping",
  "date": "2024-01-15"
}
```

**Update transaction:**
```
PUT /api/transactions/:id
Content-Type: application/json

{
  "deviceId": "device_123",
  "category": "groceries"
}
```

**Delete transaction:**
```
DELETE /api/transactions/:id
Content-Type: application/json

{
  "deviceId": "device_123"
}
```

## SMS Format Examples

The parser can handle various SMS formats:

```
// HDFC Bank
"Your A/c XX1234 is debited for Rs.500.00 on 15-Jan-24"

// ICICI Bank  
"INR 1500.00 spent on ICICI Credit Card XX5678 at SWIGGY"

// SBI
"Rs.2000 debited from A/c **1234 to UPI/merchant@upi"

// UPI
"Paid Rs.350 to Zomato via UPI. Ref: 123456789"
```

## Project Structure

```
backend/
├── src/
│   ├── server.js              # Express app entry point
│   ├── routes/
│   │   ├── sms.routes.js      # SMS parsing endpoints
│   │   ├── transaction.routes.js  # Transaction CRUD
│   │   └── health.routes.js   # Health check
│   └── services/
│       ├── smsParser.service.js   # SMS parsing logic
│       └── transaction.service.js # Transaction storage
├── .env.example
├── package.json
└── README.md
```

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication
- [ ] Budget tracking
- [ ] Recurring transaction detection
- [ ] Export to CSV/PDF
- [ ] Push notifications for budget alerts

## License

MIT
