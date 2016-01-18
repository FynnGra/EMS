package macio.ems.mcontrol;

import android.app.Fragment;
import android.content.Context;
import android.os.Bundle;
import android.view.ContextThemeWrapper;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;


public class AutoFragment
        extends     Fragment {



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
        final Context contextThemeWrapper = new ContextThemeWrapper(activity, R.style.noSwipeToDismiss);
        LayoutInflater localInflater = inflater.cloneInContext(contextThemeWrapper);

        // inflate View
        view = localInflater.inflate(R.layout.auto_fragment, viewGroup, false);

        //Back Button auf ganze View erweitern
        view.setOnTouchListener(new View.OnTouchListener() {
            public boolean onTouch(View v, MotionEvent event) {

                if(event.getAction() == MotionEvent.ACTION_UP){
                    activity.sendString("mode|close");
                    activity.vibrator.vibrate(Constants.VIBRATOR_LENGTH_MILLI);
                    activity.closeFragment();
                }
                return true;
            }
        });

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

}