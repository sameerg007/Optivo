# SMS Auto-Sync Setup Guide

This guide explains how to set up the SMS auto-sync feature for automatic expense tracking from bank SMS messages.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Android Device                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Capacitor Native Wrapper                    │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │           Next.js Web App (WebView)             │    │    │
│  │  │                                                  │    │    │
│  │  │  ┌──────────────┐    ┌──────────────────┐      │    │    │
│  │  │  │  SMS Hook    │ ←→ │  SMS Service     │      │    │    │
│  │  │  │ useSMSSync() │    │                  │      │    │    │
│  │  │  └──────────────┘    └────────┬─────────┘      │    │    │
│  │  │                               │                 │    │    │
│  │  └───────────────────────────────┼─────────────────┘    │    │
│  │                                  │                       │    │
│  │  ┌───────────────────────────────┼─────────────────┐    │    │
│  │  │         Capacitor Bridge      │                 │    │    │
│  │  └───────────────────────────────┼─────────────────┘    │    │
│  │                                  │                       │    │
│  │  ┌───────────────────────────────┼─────────────────┐    │    │
│  │  │      Native Android Plugins   ▼                 │    │    │
│  │  │  ┌──────────────────────────────────────┐      │    │    │
│  │  │  │     SMSReaderPlugin.java             │      │    │    │
│  │  │  │     - Reads SMS from Inbox           │      │    │    │
│  │  │  │     - Filters bank messages          │      │    │    │
│  │  │  │     - Returns to JavaScript          │      │    │    │
│  │  │  └──────────────────────────────────────┘      │    │    │
│  │  │                                                 │    │    │
│  │  │  ┌──────────────────────────────────────┐      │    │    │
│  │  │  │     SMSReceiver.java                 │      │    │    │
│  │  │  │     - BroadcastReceiver              │      │    │    │
│  │  │  │     - Listens for new SMS            │      │    │    │
│  │  │  │     - Real-time notifications        │      │    │    │
│  │  │  └──────────────────────────────────────┘      │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
└──────────────────────────────────┬──────────────────────────────┘
                                   │ HTTPS
                                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                     Backend Microservice                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    Express.js Server                        │  │
│  │                                                             │  │
│  │   /api/sms/parse ──────→ ┌─────────────────────┐           │  │
│  │   /api/sms/batch ──────→ │  SMS Parser Service │           │  │
│  │                          │  - Pattern matching  │           │  │
│  │                          │  - Amount extraction │           │  │
│  │                          │  - Category detect   │           │  │
│  │                          └──────────┬──────────┘           │  │
│  │                                     │                       │  │
│  │   /api/transactions ──→ ┌───────────▼───────────┐          │  │
│  │                         │ Transaction Service   │          │  │
│  │                         │ - Store transactions  │          │  │
│  │                         │ - Duplicate check     │          │  │
│  │                         │ - Summary stats       │          │  │
│  │                         └───────────────────────┘          │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## Prerequisites

- Node.js 18+
- Android Studio (for building the APK)
- Java 17 (for Android build)

## Setup Steps

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Backend Environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Start Backend Server

```bash
npm run dev
```

The server will start at `http://localhost:3001`

### 4. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 5. Configure API URL

Create or update `.env.local` in the frontend:

```env
NEXT_PUBLIC_API_URL=http://YOUR_SERVER_IP:3001/api
```

For local development:
```env
NEXT_PUBLIC_API_URL=http://10.0.2.2:3001/api
```

(10.0.2.2 is how Android emulator reaches localhost)

### 6. Build Next.js for Static Export

```bash
npm run build
```

### 7. Initialize Capacitor

```bash
npx cap init
npx cap add android
npx cap sync
```

### 8. Open Android Studio

```bash
npx cap open android
```

### 9. Build APK

In Android Studio:
1. Build → Build Bundle(s) / APK(s) → Build APK(s)
2. The APK will be in `android/app/build/outputs/apk/debug/`

## Usage in Components

```jsx
import { useSMSSync } from '@/hooks';

function ExpenseTracker() {
  const {
    isAvailable,
    hasPermission,
    isLoading,
    transactions,
    error,
    requestPermission,
    syncBankSMS,
  } = useSMSSync();

  const handleSync = async () => {
    if (!hasPermission) {
      await requestPermission();
    }
    await syncBankSMS(30); // Last 30 days
  };

  return (
    <div>
      {!isAvailable && (
        <p>SMS sync only available in mobile app</p>
      )}
      
      {isAvailable && !hasPermission && (
        <button onClick={requestPermission}>
          Grant SMS Permission
        </button>
      )}
      
      {hasPermission && (
        <button onClick={handleSync} disabled={isLoading}>
          {isLoading ? 'Syncing...' : 'Sync Transactions'}
        </button>
      )}
      
      <ul>
        {transactions.map(txn => (
          <li key={txn.id}>
            {txn.type === 'debit' ? '-' : '+'} ₹{txn.amount} 
            {txn.merchant && ` at ${txn.merchant}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Permissions

The app requires the following Android permissions:

- `READ_SMS` - To read bank SMS messages
- `RECEIVE_SMS` - To detect new messages in real-time
- `INTERNET` - To communicate with the backend

Users will be prompted to grant SMS permissions when they first use the sync feature.

## Security Considerations

1. **Local Processing**: SMS content is processed locally on-device first
2. **Selective Sync**: Only bank transaction SMS are sent to the backend
3. **Device Binding**: Transactions are tied to a device ID
4. **No SMS Storage**: The backend only stores parsed transaction data, not raw SMS

## Troubleshooting

### "SMS permission not granted"
- Go to Settings → Apps → Optivo → Permissions → SMS → Allow

### "SMS reading is only available in the mobile app"
- This feature requires the native Android app, not the web browser

### "Failed to connect to backend"
- Ensure the backend server is running
- Check the API URL in environment variables
- Verify network connectivity

### "No transactions found"
- Ensure you have bank SMS in your inbox
- Check if the bank is supported (see list in backend README)

## Supported SMS Formats

See [backend/README.md](../backend/README.md#sms-format-examples) for supported SMS patterns.
