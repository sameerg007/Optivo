package com.optivo.app.receivers;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.util.Log;

import java.util.regex.Pattern;

/**
 * SMS Broadcast Receiver
 * Listens for incoming SMS and filters bank transaction messages
 */
public class SMSReceiver extends BroadcastReceiver {
    
    private static final String TAG = "SMSReceiver";
    private static final String SMS_RECEIVED_ACTION = "android.provider.Telephony.SMS_RECEIVED";
    
    // Pattern to identify transaction SMS
    private static final Pattern TRANSACTION_PATTERN = Pattern.compile(
        "(debited|credited|spent|received|withdrawn|deposited|paid|payment|purchase|transfer|txn|transaction|rs\\.?\\s*\\d+)",
        Pattern.CASE_INSENSITIVE
    );
    
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null || !SMS_RECEIVED_ACTION.equals(intent.getAction())) {
            return;
        }
        
        Bundle bundle = intent.getExtras();
        if (bundle == null) {
            return;
        }
        
        try {
            Object[] pdus = (Object[]) bundle.get("pdus");
            String format = bundle.getString("format");
            
            if (pdus == null) {
                return;
            }
            
            for (Object pdu : pdus) {
                SmsMessage smsMessage = SmsMessage.createFromPdu((byte[]) pdu, format);
                String sender = smsMessage.getDisplayOriginatingAddress();
                String body = smsMessage.getMessageBody();
                long timestamp = smsMessage.getTimestampMillis();
                
                Log.d(TAG, "SMS received from: " + sender);
                
                // Check if this looks like a bank transaction
                if (isTransactionSMS(body)) {
                    Log.d(TAG, "Bank transaction SMS detected");
                    
                    // Broadcast to the app (Capacitor plugin will handle this)
                    Intent broadcastIntent = new Intent("com.optivo.app.SMS_RECEIVED");
                    broadcastIntent.putExtra("sender", sender);
                    broadcastIntent.putExtra("body", body);
                    broadcastIntent.putExtra("timestamp", timestamp);
                    context.sendBroadcast(broadcastIntent);
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Error processing SMS", e);
        }
    }
    
    private boolean isTransactionSMS(String body) {
        if (body == null) return false;
        return TRANSACTION_PATTERN.matcher(body).find();
    }
}
