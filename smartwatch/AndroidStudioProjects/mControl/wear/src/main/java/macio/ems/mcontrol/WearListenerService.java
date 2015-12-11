package macio.ems.mcontrol;

import android.util.Log;
import android.widget.Toast;

import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.WearableListenerService;



public class WearListenerService
        extends WearableListenerService {



    @Override
    public void onMessageReceived(MessageEvent messageEvent) {
        if( messageEvent.getPath().equalsIgnoreCase(Constants.MESSAGE_RECEIVED_PATH)) {
            Toast.makeText(this, "RECEIVED!!!", Toast.LENGTH_SHORT).show();
            Log.i("MessageReceived", Constants.MESSAGE_RECEIVED_PATH);
            // String nodeId =  messageEvent.getSourceNodeId();
            //                  messageEvent.getPath();
            //                  messageEvent.getData()??;
        } else {
            super.onMessageReceived( messageEvent );
            Log.i("MessageReceived", "aökfd jkl");
        }
    }

}
