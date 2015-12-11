/*
package macio.ems.mcontrol;

import android.app.Activity;
import android.os.AsyncTask;
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
import java.net.URL;



public class MainActivity extends Activity{

    protected RestConnection currentConnection = null;
    protected long timestamp;
    // constants
    final String BASE_URL = "http://192.168.0.11:8000";
    final String TEST_TOKEN = "macio780";
    // views
    private JoystickView joystick;



    */
/** internal class for handling the connection asynchronously
     * AsyncTask<1,2,3>
     * 1: input to doInBackground
     * 2: input in onProgressUpdate
     * 3: return from doInBackground and input to onPostExecute
     *//*

    private class InitPutConnection extends AsyncTask<String, Void, RestConnection>{

        protected void onPreExecute(){
            System.out.println("pre");
            */
/*
            if(currentConnection != null){
                if(currentConnection.outputStreamWriter != null){
                    try{ currentConnection.outputStreamWriter.close(); }
                    catch(IOException | NullPointerException e){ Log.e("connectionError", e.getMessage()); }
                }
                if(currentConnection.inputStreamReader != null){
                    try{ currentConnection.inputStreamReader.close(); }
                    catch(IOException | NullPointerException e){ Log.e("connectionError", e.getMessage()); }
                }
            }
            *//*

        }

        protected RestConnection doInBackground(String... restInterfaces) {
            */
/*fixme*//*
System.out.println("doInBackround_begin");
            URL url = null;
            HttpURLConnection connection = null;
            try{
                url = new URL(BASE_URL + "/" + restInterfaces[0]);
                connection = (HttpURLConnection) url.openConnection();
                connection.setDoOutput(true);
                connection.setRequestMethod("PUT");
                connection.setRequestProperty("Content-Type", "application/json");
                connection.setRequestProperty("Accept", "application/json");
            } catch(IOException e){
                Log.e("connectionError", e.getMessage());
            }

            RestConnection restConnection = new RestConnection();
            restConnection.name = restInterfaces[0];
            OutputStream streamOut;
            InputStream streamIn;
            try{
                if(connection != null){
                    */
/*fixme*//*
System.out.println("connection is not null");
                    streamOut = connection.getOutputStream();
                    */
/*fixme*//*
System.out.println("Why does this output not show up???");
                    streamIn = connection.getInputStream();
                    restConnection.outputStreamWriter = new OutputStreamWriter(streamOut);
                    restConnection.inputStreamReader = new InputStreamReader(streamIn);
                }
                else{
                    System.out.println("connection is null");
                }
            } catch(IOException | NullPointerException e){
                Log.e("connectionError", e.getMessage());
            }

            return restConnection;
        }

        protected void onPostExecute(RestConnection restConnection) {
            */
/*fixme*//*
System.out.println("post");
            currentConnection = restConnection;
        }

    }



    private void controlRobot(int angle, int power, int direction){
        Log.i("Joystick: ", "[" + angle + "|" + power + "|" + direction + "]");
        */
/*fixme*//*
System.out.println(currentConnection);
        if(currentConnection != null){
            */
/*fixme*//*
System.out.println("currentConnection is not null");
            // requestDriveControl
            if(System.currentTimeMillis() - timestamp > 300){
                */
/*fixme*//*
System.out.println("mehr als 300ms sind verstrichen");
                if(currentConnection.name.equals("requestDriveControl")){
                    */
/*fixme*//*
System.out.println("requestDriveControl besteht schon");
                    try{
                        currentConnection.outputStreamWriter.write("{\"token\":" + TEST_TOKEN + "}");
                        currentConnection.outputStreamWriter.flush();
                    }
                    catch(IOException e){
                        Log.e("connectionError", e.getMessage());
                    }
                }
                else{
                    */
/*fixme*//*
System.out.println("requestDriveControl besteht noch nicht");
                    new InitPutConnection().execute("requestDriveControl");
                    timestamp = System.currentTimeMillis();
                }
            }
            // driveControl with existing connection
            else if(currentConnection.name.equals("driveControl")){
                */
/*fixme*//*
System.out.println("driveControl besteht schon");
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

                try{
                    currentConnection.outputStreamWriter.write("{\"token\":" + TEST_TOKEN + ",\"speed\":" + roboSpeed + ",\"direction\":" + roboDirection + "}");
                }
                catch(IOException e){ Log.e("connectionError", e.getMessage()); }
                timestamp = System.currentTimeMillis();
            }
            // driveControl without existing connection
            else{
                */
/*fixme*//*
System.out.println("driveControl besteht noch nicht");
                new InitPutConnection().execute("driveControl");
            }
        }
        */
/*fixme*//*
System.out.println("controlRobotConditions abgearbeitet");
    }




    private void controlMenu(int angle, int power, int direction){
    }




    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

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
    protected void onResume(){
        super.onResume();

        new InitPutConnection().execute("requestDriveControl");
        timestamp = System.currentTimeMillis();
    }



    @Override
    protected void onStop(){
        super.onStop();
        */
/*
        try{ currentConnection.outputStreamWriter.close(); } catch(IOException e){ Log.e("connectionError", e.getMessage()); }
        try{ currentConnection.inputStreamReader.close(); } catch(IOException e){ Log.e("connectionError", e.getMessage()); }
        *//*

    }
}
*/
