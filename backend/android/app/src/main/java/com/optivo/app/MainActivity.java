package com.optivo.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.optivo.app.plugins.SMSReaderPlugin;

public class MainActivity extends BridgeActivity {
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Register our custom SMS Reader plugin
        registerPlugin(SMSReaderPlugin.class);
        
        super.onCreate(savedInstanceState);
    }
}
