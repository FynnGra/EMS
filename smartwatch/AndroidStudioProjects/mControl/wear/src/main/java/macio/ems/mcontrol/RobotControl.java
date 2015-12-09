package macio.ems.mcontrol;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.wearable.activity.WearableActivity;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;


public class RobotControl
        extends WearableActivity
        implements View.OnClickListener {



    // constants
    final String BASE_URL = "http://192.168.0.11:8000";
    final String TEST_TOKEN = "macio780";

    // views
    private JoystickView joystick;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_robot_control);
        joystick = (JoystickView) findViewById(R.id.joystick);

        // prevent activity from auto locking the screen
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }



    @Override
    protected void onResume(){
        super.onResume();

        // takes an Listener and an update Interval (in ms)
        joystick.setOnJoystickMoveListener(new JoystickView.OnJoystickMoveListener() {
            @Override
            public void onValueChanged(int angle, int power, int direction) {
                Integer[] controlValues = {angle, power, direction};
                new ConnectionWorker().executeOnExecutor(AsyncTask.SERIAL_EXECUTOR, controlValues);
            }
        }, 100);
    }



    @Override
    protected void onStop(){
        super.onStop();
    }



    public void onClick(View view){
        Intent intent;
        switch( getResources().getResourceEntryName(view.getId()) ) {
            case "backButton":
                intent = new Intent(RobotControl.this, MainActivity.class);
                RobotControl.this.startActivity(intent);
        }
    }



}
