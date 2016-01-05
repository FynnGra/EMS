package macio.ems.mcontrol;

import android.app.Fragment;
import android.content.Context;
import android.os.Bundle;
import android.view.ContextThemeWrapper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;



public class CockpitFragment
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
        view = localInflater.inflate(R.layout.cockpit_fragment, viewGroup, false);

        view.findViewById(R.id.backcockpit).setOnClickListener(
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



}