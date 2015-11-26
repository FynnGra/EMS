package macio.ems.mcontrol;

import android.app.Activity;
import android.os.Bundle;
import android.support.wearable.view.WatchViewStub;
import android.util.Log;
import android.view.WindowManager;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;


public class MainActivity extends Activity {

    private JoystickView joystick;
    private long timestamp;
    private String token;
    private OutputStreamWriter requestDriveControlOSW;
    private OutputStreamWriter driveControlOSW;
    private InputStreamReader requestDriveControlISR;
    private InputStreamReader driveControlISR;




    private void initializeRequestDriveControl(){
        URL url = null;
        HttpURLConnection connection = null;
        try{ url = new URL("192.168.1.1:8000/requestDriveControl"); } catch(MalformedURLException e){ Log.e("connectionError", e.getMessage()); }
        try{ connection = (HttpURLConnection) url.openConnection();} catch(Exception e){ Log.e("connectionError", e.getMessage()); }
        try{ connection.setRequestMethod("PUT"); } catch(ProtocolException e){ Log.e("connectionError", e.getMessage()); }
        connection.setDoOutput(true);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestProperty("Accept", "application/json");

        OutputStream streamOut = null;
        try{ streamOut = connection.getOutputStream(); } catch(IOException e){ Log.e("connectionError", e.getMessage()); }
        this.requestDriveControlOSW = new OutputStreamWriter(streamOut);

        InputStream streamIn = null;
        try{ streamIn = connection.getInputStream(); } catch(IOException e){ Log.e("connectionError", e.getMessage()); }
        this.requestDriveControlISR = new InputStreamReader(streamIn);
    }



    private void initializeDriveControl(){
        URL url = null;
        HttpURLConnection connection = null;
        try{ url = new URL("192.168.1.1:8000/driveControl"); } catch(MalformedURLException e){ Log.e("connectionError", e.getMessage()); }
        try{ connection = (HttpURLConnection) url.openConnection();} catch(Exception e){ Log.e("connectionError", e.getMessage()); }
        try{ connection.setRequestMethod("PUT"); } catch(ProtocolException e){ Log.e("connectionError", e.getMessage()); }
        connection.setDoOutput(true);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestProperty("Accept", "application/json");

        OutputStream streamOut = null;
        try{ streamOut = connection.getOutputStream(); } catch(IOException e){ Log.e("connectionError", e.getMessage()); }
        this.driveControlOSW = new OutputStreamWriter(streamOut);

        InputStream streamIn = null;
        try{ streamIn = connection.getInputStream(); } catch(IOException e){ Log.e("connectionError", e.getMessage()); }
        this.driveControlISR = new InputStreamReader(streamIn);
    }



    private void controlRobot(int angle, int power, int direction){
        Log.i("Joystick: ", "[" + angle + "|" + power + "|" + direction + "]");

        // Request Drive Control
        if(System.currentTimeMillis() - timestamp > 300){
            try{ requestDriveControlOSW.write("{\"token\":" + token + "}"); } catch(IOException e){ Log.e("connectionError", e.getMessage()); }
            try{ requestDriveControlOSW.flush(); } catch(IOException e){ Log.e("connectionError", e.getMessage()); }
        }

        int roboSpeed = power;
        int roboDirection = 0;

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

        try{ driveControlOSW.write("{\"token\":" + token + ",\"speed\":" + roboSpeed + ",\"direction\":" + roboDirection + "}"); } catch(IOException e){ Log.e("connectionError", e.getMessage()); }
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

        initializeRequestDriveControl();
        initializeDriveControl();

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



    @Override
    protected void onStop(){
        super.onStop();
        try{ requestDriveControlOSW.close(); } catch(IOException e){ Log.e("connectionError", e.getMessage()); }
        try{ driveControlOSW.close(); } catch(IOException e){ Log.e("connectionError", e.getMessage()); }
        try{ requestDriveControlISR.close(); } catch(IOException e){ Log.e("connectionError", e.getMessage()); }
        try{ driveControlISR.close(); } catch(IOException e){ Log.e("connectionError", e.getMessage()); }
    }
}
