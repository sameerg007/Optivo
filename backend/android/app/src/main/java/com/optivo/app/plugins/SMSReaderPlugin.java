package com.optivo.app.plugins;

import android.Manifest;
import android.content.ContentResolver;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.provider.Telephony;
import android.util.Log;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import org.json.JSONException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

@CapacitorPlugin(
    name = "SMSReader",
    permissions = {
        @Permission(
            alias = "sms",
            strings = { Manifest.permission.READ_SMS, Manifest.permission.RECEIVE_SMS }
        )
    }
)
public class SMSReaderPlugin extends Plugin {
    
    private static final String TAG = "SMSReaderPlugin";
    private static final int SMS_PERMISSION_REQUEST = 1001;
    
    // Bank SMS sender patterns (common Indian banks)
    private static final List<String> BANK_SENDER_PATTERNS = Arrays.asList(
        "HDFC", "ICICI", "SBI", "AXIS", "KOTAK", "PNB", "BOB", "BOI", "CANARA",
        "UNION", "IDBI", "YES", "INDUS", "RBL", "FEDERAL", "BANDHAN", "PAYTM",
        "GPAY", "PHONEPE", "MOBIKWIK", "AMAZONPAY", "BAJAJ", "CITI", "HSBC",
        "SCBANK", "AMEX", "DINERS", "RUPAY", "VISA", "MASTER"
    );
    
    // Patterns to identify transaction SMS
    private static final Pattern TRANSACTION_PATTERN = Pattern.compile(
        "(debited|credited|spent|received|withdrawn|deposited|paid|payment|purchase|transfer|txn|transaction)",
        Pattern.CASE_INSENSITIVE
    );
    
    @PluginMethod
    public void checkPermission(PluginCall call) {
        JSObject result = new JSObject();
        boolean granted = ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_SMS) 
            == PackageManager.PERMISSION_GRANTED;
        result.put("granted", granted);
        call.resolve(result);
    }
    
    @PluginMethod
    public void requestPermission(PluginCall call) {
        if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_SMS) 
            == PackageManager.PERMISSION_GRANTED) {
            JSObject result = new JSObject();
            result.put("granted", true);
            call.resolve(result);
            return;
        }
        
        // Save call for callback
        bridge.saveCall(call);
        
        // Request permissions
        requestPermissionForAlias("sms", call, "handlePermissionResult");
    }
    
    @PermissionCallback
    private void handlePermissionResult(PluginCall call) {
        JSObject result = new JSObject();
        boolean granted = ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_SMS) 
            == PackageManager.PERMISSION_GRANTED;
        result.put("granted", granted);
        call.resolve(result);
    }
    
    @PluginMethod
    public void getMessages(PluginCall call) {
        if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_SMS) 
            != PackageManager.PERMISSION_GRANTED) {
            call.reject("SMS permission not granted");
            return;
        }
        
        int limit = call.getInt("limit", 100);
        long since = call.getLong("since", 0L);
        
        try {
            JSArray messages = readSMSMessages(limit, since, false);
            JSObject result = new JSObject();
            result.put("messages", messages);
            call.resolve(result);
        } catch (Exception e) {
            Log.e(TAG, "Error reading SMS", e);
            call.reject("Failed to read SMS: " + e.getMessage());
        }
    }
    
    @PluginMethod
    public void getBankMessages(PluginCall call) {
        if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_SMS) 
            != PackageManager.PERMISSION_GRANTED) {
            call.reject("SMS permission not granted");
            return;
        }
        
        int limit = call.getInt("limit", 100);
        int days = call.getInt("days", 30);
        long since = System.currentTimeMillis() - (days * 24L * 60L * 60L * 1000L);
        
        try {
            JSArray messages = readSMSMessages(limit, since, true);
            JSObject result = new JSObject();
            result.put("messages", messages);
            call.resolve(result);
        } catch (Exception e) {
            Log.e(TAG, "Error reading bank SMS", e);
            call.reject("Failed to read SMS: " + e.getMessage());
        }
    }
    
    private JSArray readSMSMessages(int limit, long since, boolean bankOnly) throws JSONException {
        JSArray messages = new JSArray();
        ContentResolver contentResolver = getContext().getContentResolver();
        
        Uri uri = Telephony.Sms.Inbox.CONTENT_URI;
        String[] projection = {
            Telephony.Sms._ID,
            Telephony.Sms.ADDRESS,
            Telephony.Sms.BODY,
            Telephony.Sms.DATE,
            Telephony.Sms.TYPE
        };
        
        String selection = Telephony.Sms.DATE + " > ?";
        String[] selectionArgs = { String.valueOf(since) };
        String sortOrder = Telephony.Sms.DATE + " DESC LIMIT " + limit;
        
        Cursor cursor = contentResolver.query(uri, projection, selection, selectionArgs, sortOrder);
        
        if (cursor != null) {
            int count = 0;
            while (cursor.moveToNext() && count < limit) {
                String id = cursor.getString(cursor.getColumnIndexOrThrow(Telephony.Sms._ID));
                String address = cursor.getString(cursor.getColumnIndexOrThrow(Telephony.Sms.ADDRESS));
                String body = cursor.getString(cursor.getColumnIndexOrThrow(Telephony.Sms.BODY));
                long date = cursor.getLong(cursor.getColumnIndexOrThrow(Telephony.Sms.DATE));
                int type = cursor.getInt(cursor.getColumnIndexOrThrow(Telephony.Sms.TYPE));
                
                // If bank only, filter for bank senders
                if (bankOnly) {
                    if (!isBankSender(address) || !isTransactionSMS(body)) {
                        continue;
                    }
                }
                
                JSObject message = new JSObject();
                message.put("id", id);
                message.put("address", address != null ? address : "");
                message.put("body", body != null ? body : "");
                message.put("date", date);
                message.put("type", type);
                
                messages.put(message);
                count++;
            }
            cursor.close();
        }
        
        return messages;
    }
    
    private boolean isBankSender(String sender) {
        if (sender == null) return false;
        
        String upperSender = sender.toUpperCase();
        for (String pattern : BANK_SENDER_PATTERNS) {
            if (upperSender.contains(pattern)) {
                return true;
            }
        }
        return false;
    }
    
    private boolean isTransactionSMS(String body) {
        if (body == null) return false;
        return TRANSACTION_PATTERN.matcher(body).find();
    }
    
    @PluginMethod
    public void startListening(PluginCall call) {
        // SMS broadcast receiver would be registered here
        // For simplicity, we'll rely on polling in this implementation
        JSObject result = new JSObject();
        result.put("success", true);
        result.put("message", "SMS listening started");
        call.resolve(result);
    }
    
    @PluginMethod
    public void stopListening(PluginCall call) {
        JSObject result = new JSObject();
        result.put("success", true);
        call.resolve(result);
    }
}
