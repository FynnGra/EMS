package macio.ems.mcontrol;


import android.app.FragmentManager;
import android.os.Bundle;
import android.os.Vibrator;
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
import java.util.List;



public class MenuControl
        extends     WearableActivity
        implements  MessageApi.MessageListener,
                    ConnectionCallbacks,
                    OnConnectionFailedListener {



    private FragmentManager fragmentManager = null;
    private boolean fragmentFlag = false;

    private MenuFragment menuFragment = null;
    private JoystickFragment joystickFragment = null;
    private CockpitFragment cockpitFragment = null;
    private AutoFragment autoFragment = null;

    private GoogleApiClient mGoogleApiClient = null;
    private String nodeId = null;

    public Vibrator vibrator = null;



    /**********************************************************************************************
     ***************************** Android Lifecyle Methods ***************************************
    **********************************************************************************************/
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu_control);

        // prevent activity from auto locking the screen
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        // false = currently no Fragment attached
        fragmentFlag = false;

        mGoogleApiClient = new GoogleApiClient.Builder( this )
                .addApi( Wearable.API )
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .build();
    }

    @Override
    protected void onStart(){
        super.onStart();

        // initialize Wear Connection
        if( mGoogleApiClient != null && !( mGoogleApiClient.isConnected() || mGoogleApiClient.isConnecting() ) ){
            mGoogleApiClient.connect();
        }
        this.retreiveDeviceNode();
        Wearable.MessageApi.addListener(mGoogleApiClient, this);

        vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);

        // initialize Fragments
        fragmentManager = getFragmentManager();
        menuFragment = new MenuFragment();
        joystickFragment = new JoystickFragment();
        cockpitFragment = new CockpitFragment();
        autoFragment = new AutoFragment();


        // back button
        this.findViewById(R.id.backactivity).setOnClickListener(
                new View.OnClickListener() {
                    public void onClick(View v) {
                        closeFragment();
                        sendString("mode|close");
                        vibrator.vibrate(Constants.VIBRATOR_LENGTH_MILLI);
                    }
                }
        );

    }

    @Override
    protected void onResume(){
        super.onResume();
    }

    @Override
    protected void onPause(){
        super.onPause();
        sendString("mode|close");
    }

    @Override
    protected void onStop(){
        super.onStop();

        mGoogleApiClient.disconnect();
        Wearable.MessageApi.removeListener(mGoogleApiClient, this);
    }



    /**********************************************************************************************
     ************** Interfaces: ConnectionCallbacks and OnConnectionFailedListener ****************
     **********************************************************************************************/
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



    /**********************************************************************************************
     ************************************ Message API *********************************************
     **********************************************************************************************/
    @Override
    public void onMessageReceived(MessageEvent messageEvent ) {
        // Toast.makeText(this, "EMPFANGEN: " + new String(messageEvent.getData()), Toast.LENGTH_SHORT).show();
        // String nodeId =  messageEvent.getSourceNodeId();
        //                  messageEvent.getPath();

        String message = new String(messageEvent.getData());
        Log.i("Message received: ", message);
        switch(message){
            case "menu":
                showMenuFragment();
                break;
            case "joystick":
                showJoystickFragment();
                break;
            case "cockpit":
                showCockpitFragment();
                break;
            case "auto":
                showAutoFragrment();
                break;
            default:
                Toast.makeText(this, "unknown message", Toast.LENGTH_SHORT).show();
        }

    }



    public void sendString(String s) {
        Wearable.MessageApi.sendMessage(
                mGoogleApiClient,
                nodeId,
                Constants.MESSAGE_PATH,
                s.getBytes());
    }



    /**********************************************************************************************
     *************************************** Fragment Stuff ***************************************
     **********************************************************************************************/
    public void showMenuFragment() {
        vibrator.vibrate(Constants.VIBRATOR_LENGTH_MILLI);
        if(fragmentFlag){
            if(!(fragmentManager.findFragmentByTag("frag") instanceof MenuFragment)){
                Log.i("Fragment", "replaced");
                fragmentManager
                        .beginTransaction()
                        .replace(R.id.fragmentLayout, menuFragment, "frag")
                        .commit();
            }
        }
        else{
            Log.i("Fragment", "added");
            fragmentManager
                    .beginTransaction()
                    .add(R.id.fragmentLayout, menuFragment, "frag")
                    .commit();
        }
        fragmentFlag = true;
    }

    public void showJoystickFragment() {
        if(fragmentFlag){
            if(!(fragmentManager.findFragmentByTag("frag") instanceof JoystickFragment)){
                Log.i("Fragment", "replaced");
                fragmentManager
                        .beginTransaction()
                        .replace(R.id.fragmentLayout, joystickFragment, "frag")
                        .commit();
            }
        }
        else{
            Log.i("Fragment", "added");
            fragmentManager
                    .beginTransaction()
                    .add(R.id.fragmentLayout, joystickFragment, "frag")
                    .commit();
        }
        fragmentFlag = true;
    }



    public void showCockpitFragment() {
        if(fragmentFlag){
            if(!(fragmentManager.findFragmentByTag("frag") instanceof CockpitFragment)){
                Log.i("Fragment", "replaced");
                fragmentManager
                        .beginTransaction()
                        .replace(R.id.fragmentLayout, cockpitFragment, "frag")
                        .commit();
            }
        }
        else{
            Log.i("Fragment", "added");
            fragmentManager
                    .beginTransaction()
                    .add(R.id.fragmentLayout, cockpitFragment, "frag")
                    .commit();
        }
        fragmentFlag = true;
    }



    public void showAutoFragrment() {
        if(fragmentFlag){
            if(!(fragmentManager.findFragmentByTag("frag") instanceof AutoFragment)){
                Log.i("Fragment", "replaced");
                fragmentManager
                        .beginTransaction()
                        .replace(R.id.fragmentLayout, autoFragment, "frag")
                        .commit();
            }
        }
        else{
            Log.i("Fragment", "added");
            fragmentManager
                    .beginTransaction()
                    .add(R.id.fragmentLayout, autoFragment, "frag")
                    .commit();
        }
        fragmentFlag = true;
    }



    public void closeFragment() {
        Log.i("closeFragment", "start");
        if(fragmentFlag) {
            Log.i("closeFragment", "ifFragmentFlag");
            fragmentManager
                    .beginTransaction()
                    .remove(fragmentManager.findFragmentByTag("frag"))
                    .commit();
            fragmentFlag = false;
        }
    }



    /**********************************************************************************************
     *********************************** Helper functions *****************************************
     **********************************************************************************************/
    private void retreiveDeviceNode(){

        new Thread(new Runnable() {
            @Override
            public void run() {
                NodeApi.GetConnectedNodesResult result = Wearable.NodeApi.getConnectedNodes(mGoogleApiClient).await();
                List<Node> nodes = result.getNodes();
                if(nodes.size() > 0) {
                    nodeId = nodes.get(0).getId();
                    Log.i("nodeId", nodeId);
                }
            }
        }).start();
    }



}
