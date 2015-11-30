package macio.ems.mcontrol;

import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

public class RestConnection {

    public String name;
    public OutputStreamWriter outputStreamWriter;
    public InputStreamReader inputStreamReader;

    RestConnection(){
        name = null;
        outputStreamWriter = null;
        inputStreamReader = null;
    }
}
