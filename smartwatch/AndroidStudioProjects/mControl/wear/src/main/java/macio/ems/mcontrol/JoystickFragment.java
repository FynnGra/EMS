package macio.ems.mcontrol;

import android.app.Fragment;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.ContextThemeWrapper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;


public class JoystickFragment extends Fragment {



    private JoystickView joystick;
    private MenuControl activity = null;
    private View view = null;



    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        activity = (MenuControl) getActivity();
    }



    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup viewGroup, Bundle savedInstanceState) {
        super.onCreateView(inflater, viewGroup, savedInstanceState);

        // apply custom theme
        final Context contextThemeWrapper = new ContextThemeWrapper(getActivity(), R.style.noSwipeToDismiss);
        LayoutInflater localInflater = inflater.cloneInContext(contextThemeWrapper);

        // inflate view
        view = localInflater.inflate(R.layout.joystick_fragment, viewGroup, false);

        view.findViewById(R.id.backjoystick).setOnClickListener(
                new View.OnClickListener() {
                    public void onClick(View v) {
                        activity.closeFragment();
                        activity.sendString("close");
                    }
                }
        );

        return view;
    }



    @Override
    public void onStart() {
        super.onStart();

        View view = getView();
        if(view != null){
            joystick = (JoystickView) view.findViewById(R.id.joystick);
        }
    }



    @Override
    public void onResume(){
        super.onResume();

        // takes an Listener and an update Interval (in ms)
        joystick.setOnJoystickMoveListener(new JoystickView.OnJoystickMoveListener() {
            @Override
            public void onValueChanged(int angle, int power, int direction) {
                // Log.i("Joystick: ", "[" + angle + "|" + power + "|" + direction + "]");
                calculateControls(angle, power, direction);
            }
        }, 100);
    }



    @Override
    public void onPause() {
        super.onPause();
    }



    private void calculateControls(int angle, int power, int direction) {
        int roboSpeed = (int) ((power/100.0) * Constants.DRIVE_MAX_SPEED);
        int roboDirection = 0;

        // vorwärts
        if(angle < 90 && angle > -90)
            roboDirection = (int) ((angle/90.0)*100.0);
        // rückwärts
        else{
            // rechts
            if(angle < 0)

                roboDirection = (int) (( ((180 + angle)*-1) /90.0)*100.0);
            // links
            else if(angle > 0)
                roboDirection = (int) (( ((180 - angle)*-1) /90.0)*100.0);
        }

        Log.i("Joystick: ", "[" + roboDirection + "|" + roboSpeed + "]");
        activity.sendString("drive|" + roboDirection + "," + roboSpeed);
    }



}
