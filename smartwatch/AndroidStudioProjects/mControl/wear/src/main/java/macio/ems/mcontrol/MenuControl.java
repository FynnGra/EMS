package macio.ems.mcontrol;

import android.content.Intent;
import android.os.Bundle;
import android.support.wearable.activity.WearableActivity;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.Toast;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.GoogleApiClient.ConnectionCallbacks;
import com.google.android.gms.common.api.GoogleApiClient.OnConnectionFailedListener;
import com.google.android.gms.wearable.MessageApi;
import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.Node;
import com.google.android.gms.wearable.NodeApi;
import com.google.android.gms.wearable.Wearable;

import java.util.Collection;
import java.util.List;


public class MenuControl
        extends     WearableActivity
        implements  View.OnClickListener,
                    MessageApi.MessageListener,
                    ConnectionCallbacks,
                    OnConnectionFailedListener{



    GoogleApiClient mGoogleApiClient = null;
    private static final String MESSAGE_PATH = "/message";
    private String nodeId = null;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu_control);
        // prevent activity from auto locking the screen
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        mGoogleApiClient = new GoogleApiClient.Builder( this )
                .addApi( Wearable.API )
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .build();
    }

    @Override
    protected void onStart(){
        super.onStart();

        if( mGoogleApiClient != null && !( mGoogleApiClient.isConnected() || mGoogleApiClient.isConnecting() ) ){
            mGoogleApiClient.connect();
        }
        retreiveDeviceNode();
    }

    @Override
    protected void onResume(){
        super.onResume();
    }

    @Override
    protected void onStop(){
        super.onStop();
        mGoogleApiClient.disconnect();
    }



    @Override
    public void onConnected(Bundle bundle) {
        // Wearable.MessageApi.addListener(mGoogleApiClient, this);
        Log.i("onConnected", "connected");
    }

    @Override
    public void onConnectionSuspended(int cause) {
        Log.i("onConnectionSuspended", "suspended");
    }

    @Override
    public void onConnectionFailed(ConnectionResult result) {
        Log.i("onConnectionFailed", "failed");
    }


    // obsolet?
    @Override
    public void onMessageReceived( final MessageEvent messageEvent ) {
        Toast.makeText(this, "EMPFANGEN!!!", Toast.LENGTH_SHORT).show();
    }


    private void retreiveDeviceNode(){

        new Thread(new Runnable() {
            @Override
            public void run() {
                NodeApi.GetConnectedNodesResult result = Wearable.NodeApi.getConnectedNodes(mGoogleApiClient).await();
                List<Node> nodes = result.getNodes();
                if(nodes.size() > 0) {
                    nodeId = nodes.get(0).getId();
                }
                Log.i("nodeId", nodeId);
            }
        }).start();
    }

    // onClick
    public void send(View view){
        Wearable.MessageApi.sendMessage(mGoogleApiClient, nodeId, Constants.MESSAGE_RECEIVED_PATH, null);
    }

    public void onClick(View view){
        Intent intent;
        switch( getResources().getResourceEntryName(view.getId()) ) {
            case "backButton":
                intent = new Intent(MenuControl.this, MainActivity.class);
                MenuControl.this.startActivity(intent);
        }
    }



}
