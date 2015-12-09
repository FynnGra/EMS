package macio.ems.mcontrol;

import android.content.Intent;
import android.os.Bundle;
import android.support.wearable.activity.WearableActivity;
import android.view.View;
import android.view.WindowManager;



public class MenuControl
        extends WearableActivity
        implements View.OnClickListener {



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu_control);

        // prevent activity from auto locking the screen
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }



    @Override
    protected void onResume(){
        super.onResume();
    }



    @Override
    protected void onStop(){
        super.onStop();
    }



    public void onClick(View view){
        Intent intent;
        switch( getResources().getResourceEntryName(view.getId()) ) {
            case "backButton":
                intent = new Intent(MenuControl.this, MainActivity.class);
                MenuControl.this.startActivity(intent);
        }
    }



}
