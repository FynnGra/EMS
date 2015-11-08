package macio.ems.mcontrol;

import android.app.Activity;
import android.os.Bundle;
import android.support.wearable.view.WatchViewStub;
import android.util.Log;
import android.view.WindowManager;




public class MainActivity extends Activity {

    private JoystickView joystick;
    private long timestamp;
    private String token;



    private void controlRobot(int angle, int power, int direction){
        Log.i("Joystick: ", "[" + angle + "|" + power + "|" + direction + "]");

        if(System.currentTimeMillis() - timestamp > 300)
            Log.i("PUT: ", "RequestDriveControl");

        int roboSpeed = power;
        int roboDirection;

        // vorwärts
        if(angle < 90 && angle > -90)
            roboDirection = angle;
        // rückwärts
        else{
            // rechts
            if(angle < 0)
                roboDirection =  (180 + angle) * -1;
            // links
            else if(angle > 0)
                roboDirection = (180 - angle) * -1;
        }

        // TODO: send PUT request containing roboSpeed, roboDirection and token

        timestamp = System.currentTimeMillis();
    }




    private void controlMenu(int angle, int power, int direction){
    }




    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        timestamp = System.currentTimeMillis();
        token = "macio780";

        // prevent activity from auto locking the screen
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        final WatchViewStub stub = (WatchViewStub) findViewById(R.id.watch_view_stub);
        stub.setOnLayoutInflatedListener(new WatchViewStub.OnLayoutInflatedListener() {
            @Override
            public void onLayoutInflated(WatchViewStub stub) {
                joystick = (JoystickView) stub.findViewById(R.id.joystick);
                // takes an Listener and an update Interval (in ms)
                joystick.setOnJoystickMoveListener(new JoystickView.OnJoystickMoveListener(){
                    @Override
                    public void onValueChanged(int angle, int power, int direction){
                        controlRobot(angle, power, direction);
                    }
                }, 100);
            }
        });
    }
}
