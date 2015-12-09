package macio.ems.mcontrol;

import android.content.Context;
import android.content.Intent;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.support.wearable.activity.WearableActivity;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;



public class MainActivity
        extends WearableActivity
        implements View.OnClickListener {



    private WifiManager wifiManager = null;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d("mCall", "onCreate()");
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // prevent activity from auto locking the screen
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        setAmbientEnabled();

        // wifiManager = (WifiManager) getSystemService(Context.WIFI_SERVICE);
    }



    @Override
    protected void onStart(){
        Log.d("mCall", "onStart()");
        super.onStart();
    }



    @Override
    protected void onResume() {
        Log.d("mCall", "onResume()");
        super.onResume();
    }



    @Override
    protected void onPause() {
        Log.d("mCall", "onPause()");
        super.onPause();
    }



    @Override
    protected void onStop() {
        Log.d("mCall", "onStop()");
        super.onStop();
    }



    @Override
    protected void onDestroy(){
        Log.d("mCall", "onDestroy()");
        super.onDestroy();
    }



    @Override
    public void onEnterAmbient(Bundle ambientDetails) {
        Log.d("mCall", "onEnterAmbient()");
        super.onEnterAmbient(ambientDetails);
    }



    @Override
    public void onExitAmbient() {
        Log.d("mCall", "onExitAmbient()");
        super.onExitAmbient();
    }



    public void onClick(View view){
        Log.d("mCall", "onClick(" + getResources().getResourceEntryName(view.getId()) + ")");

        Intent intent;
        switch( getResources().getResourceEntryName(view.getId()) ){
            case "menuButton":
                intent = new Intent(MainActivity.this, MenuControl.class);
                MainActivity.this.startActivity(intent);
                break;
            case "roboButton":
                intent = new Intent(MainActivity.this, RobotControl.class);
                MainActivity.this.startActivity(intent);
                break;
            case "wifiButton":
                Log.i("WifiButton", "clicked");
        }
    }



}
