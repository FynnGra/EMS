


////////////////////////// Gesture Overlay //////////////////////////////

/*

package macio.ems.mcontrol;

import android.app.Activity;
import android.app.Fragment;
import android.content.Context;
import android.content.Intent;
import android.gesture.Gesture;
import android.gesture.GestureLibraries;
import android.gesture.GestureLibrary;
import android.gesture.GestureOverlayView;
import android.gesture.Prediction;
import android.os.Bundle;
import android.util.Log;
import android.view.ContextThemeWrapper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import com.google.android.gms.wearable.Wearable;

import java.util.ArrayList;


public class MenuFragment
        extends     Fragment
        implements  GestureOverlayView.OnGesturePerformedListener {



    GestureLibrary mLibrary;
    GestureOverlayView gestureOverlay;
    Activity activity = null;



    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }



    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup viewGroup, Bundle savedInstanceState) {
        super.onCreateView(inflater, viewGroup, savedInstanceState);

        // apply custom theme
        final Context contextThemeWrapper = new ContextThemeWrapper(getActivity(), R.style.noSwipeToDismiss);
        LayoutInflater localInflater = inflater.cloneInContext(contextThemeWrapper);

        // inflate View
        return localInflater.inflate(R.layout.menu_fragment, viewGroup, false);
    }



    @Override
    public void onStart(){
        super.onStart();


        mLibrary = GestureLibraries.fromRawResource(getActivity(), R.raw.gestures);
        gestureOverlay = (GestureOverlayView) getView().findViewById(R.id.gestureOverlay);
        gestureOverlay.addOnGesturePerformedListener(this);
    }



    @Override
    public void onPause() {
        super.onPause();
    }



    public void onGesturePerformed(GestureOverlayView gestureOverlay, Gesture gesture){
        ArrayList<Prediction> predictions = mLibrary.recognize(gesture);

        Log.i("PredictionSize", "" + predictions.size());

        if (predictions.size() > 0 && predictions.get(0).score > 1.0) {
            String result = predictions.get(0).name;
            Log.i("Gesture", result + ": " + predictions.get(0).score);

            switch(result){
                case "UP":
                    Toast.makeText(getActivity(), result, Toast.LENGTH_SHORT).show();
                    break;
                case "DOWN":
                    Toast.makeText(getActivity(), result, Toast.LENGTH_SHORT).show();
                    break;
                case "LEFT":
                    Toast.makeText(getActivity(), result, Toast.LENGTH_SHORT).show();
                    break;
                case "RIGHT":
                    Toast.makeText(getActivity(), result, Toast.LENGTH_SHORT).show();
                    break;
                case "CIRCLE":
                    Toast.makeText(getActivity(), result, Toast.LENGTH_SHORT).show();
                    break;
                default:
                    Log.i("Gesture", "unknown gesture");
            }

        }
    }



}

 */






