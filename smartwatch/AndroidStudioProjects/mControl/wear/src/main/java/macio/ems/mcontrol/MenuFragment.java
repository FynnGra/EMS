package macio.ems.mcontrol;

import android.app.Activity;
import android.app.Fragment;
import android.content.Context;
import android.os.Bundle;
import android.support.v4.view.MotionEventCompat;
import android.util.Log;
import android.view.ContextThemeWrapper;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;



public class MenuFragment
        extends     Fragment
        implements  View.OnTouchListener {



    private MenuControl activity = null;
    private View view = null;
    private float diffX = 0, diffY = 0, downX = 0, downY = 0;



    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        activity = (MenuControl) getActivity();
    }



    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup viewGroup, Bundle savedInstanceState) {
        super.onCreateView(inflater, viewGroup, savedInstanceState);

        // apply custom theme
        final Context contextThemeWrapper = new ContextThemeWrapper(activity, R.style.noSwipeToDismiss);
        LayoutInflater localInflater = inflater.cloneInContext(contextThemeWrapper);

        // inflate View
        view = localInflater.inflate(R.layout.menu_fragment, viewGroup, false);

        view.setOnTouchListener(this);

        view.findViewById(R.id.backmenu).setOnClickListener(
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
    public void onStart(){
        super.onStart();
    }



    @Override
    public void onPause() {
        super.onPause();
    }


    @Override
    public boolean onTouch(View v, MotionEvent event) {

        int action = MotionEventCompat.getActionMasked(event);
        switch(action) {
            case (MotionEvent.ACTION_DOWN) :
                //Log.i("Action", "down");
                downX = event.getX();
                downY = event.getY();
                return true;
            case (MotionEvent.ACTION_MOVE) :
                //Log.i("Action", "move");
                return true;
            case (MotionEvent.ACTION_UP) :

                diffX = downX - event.getX();
                diffY = downY - event.getY();

                if(Math.abs(diffX) < Constants.TAP_THRESHOLD && Math.abs(diffY) < Constants.TAP_THRESHOLD){
                    Log.i("tap", "...");
                    activity.vibrator.vibrate(Constants.VIBRATOR_LENGTH_MILLI);
                    activity.sendString("menu|tap");
                }
                else{
                    if(Math.abs(diffX) > Math.abs(diffY)){
                        if(diffX > 0){
                            Log.i("swipe", "left");
                            activity.sendString("menu|left");
                        }
                        else{
                            Log.i("swipe", "right");
                            activity.sendString("menu|right");
                        }
                    }
                    else{
                        if(diffY > 0){
                            Log.i("swipe", "up");
                            activity.sendString("menu|up");
                            activity.vibrator.vibrate(Constants.VIBRATOR_LENGTH_MILLI);

                        }
                        else{
                            Log.i("swipe", "down");
                            activity.sendString("menu|down");
                            activity.vibrator.vibrate(Constants.VIBRATOR_LENGTH_MILLI);
                        }
                    }
                }

                //Log.i("Action", "up: " + diffX + "/" + diffY);
                return true;
            case (MotionEvent.ACTION_CANCEL) :
                //Log.i("Action", "cancel");
                return true;
            case (MotionEvent.ACTION_OUTSIDE) :
                //Log.i("Action", "outside");
                return true;
            default :
                return false;
        }

    }



    public void back(){
        activity.closeFragment();
    }


}