package macio.ems.mcontrol;

import android.os.AsyncTask;
import android.util.Log;
import java.io.IOException;
import java.util.concurrent.TimeoutException;



/** internal class for handling the connection asynchronously
 * AsyncTask<1,2,3>
 * 1: input to doInBackground
 * 2: input in onProgressUpdate
 * 3: return from doInBackground and input to onPostExecute
 */
public class ConnectionWorker
        extends AsyncTask<Integer, String, Integer> {



    @Override
    protected void onPreExecute() {
        // Log.i("onPreExecute", "success");
    }



    @Override
    protected Integer doInBackground(Integer... controlValues) {
        int angle = controlValues[0];
        int power = controlValues[1];
        int direction = controlValues[2];
        Log.i("Joystick: ", "[" + angle + "|" + power + "|" + direction + "]");

        RestConnection restConnection = null;
        try{
            restConnection = new RestConnection(Constants.BASE_URL, "requestDriveControl");



            restConnection.disconnect();
        } catch(IOException | TimeoutException e) {
            Log.e("connectionError", e.getMessage());
        }
        return 0;
    }


    @Override
    protected void onProgressUpdate(String... string) {

    }


    @Override
    protected void onPostExecute(Integer i) {
        Log.i("onPostExecute", "success");
    }



}
