package unused;

import android.util.Log;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.TimeoutException;



public class RestConnection {



    private String restInterface;
    private String baseUrl;
    private long timestamp;
    HttpURLConnection connection = null;
    private OutputStreamWriter outputStreamWriter;
    private InputStreamReader inputStreamReader;



    RestConnection(String baseUrl, String restInterface)
            throws IOException, TimeoutException {

        this.restInterface = restInterface;
        this.baseUrl = baseUrl + "/" + restInterface;
        outputStreamWriter = null;
        inputStreamReader = null;
        connect();
    }



    public String getRestInterface() {
        return restInterface;
    }
    public OutputStreamWriter getOutputStreamWriter() {
        return outputStreamWriter;
    }
    public InputStreamReader getInputStreamReader() {
        return inputStreamReader;
    }
    public long getTimestamp() {
        return timestamp;
    }



    private void connect()
            throws IOException {

        int responseCode = 0;
        URL url = new URL(baseUrl + "/" + restInterface);
        OutputStream streamOut;
        InputStream streamIn;
        timestamp = System.currentTimeMillis();

        connection = (HttpURLConnection) url.openConnection();
        // responseCode = connection.getResponseCode();
        // Log.i("Response Code", "" + responseCode);
        connection.setDoOutput(true);
        connection.setRequestMethod("PUT");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestProperty("Accept", "application/json");

System.out.println("pre");
        streamOut = connection.getOutputStream();
        streamIn = connection.getInputStream();
System.out.println("post");
        outputStreamWriter = new OutputStreamWriter(streamOut);
        inputStreamReader = new InputStreamReader(streamIn);
    }



    public void reconnect(String restInterface)
            throws IOException {

        this.restInterface = restInterface;
        connect();
    }



    public void disconnect()
            throws IOException {
        inputStreamReader.close();
        outputStreamWriter.close();
        connection.disconnect();

    }



}
