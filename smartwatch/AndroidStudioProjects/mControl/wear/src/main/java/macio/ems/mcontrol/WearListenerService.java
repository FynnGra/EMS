package macio.ems.mcontrol;

// Nicht mehr benötigt, da jetzt Wearable.MessageApi.ListenerService verwendet wird

import android.util.Log;
import android.widget.Toast;

import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.WearableListenerService;



public class WearListenerService
        extends WearableListenerService {



    @Override
    public void onMessageReceived(MessageEvent messageEvent) {
        if( messageEvent.getPath().equalsIgnoreCase(Constants.MESSAGE_PATH)) {
            Toast.makeText(this, "RECEIVED: " + new String(messageEvent.getData()), Toast.LENGTH_SHORT).show();
            Log.i("MessageReceived", Constants.MESSAGE_PATH);
            // String nodeId =  messageEvent.getSourceNodeId();
            //                  messageEvent.getPath();
            //                  messageEvent.getData()??;
        } else {
            super.onMessageReceived( messageEvent );
            Log.i("MessageReceived", "aökfd jkl");
        }
    }

}
