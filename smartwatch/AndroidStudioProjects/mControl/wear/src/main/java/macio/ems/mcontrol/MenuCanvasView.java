package macio.ems.mcontrol;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.util.AttributeSet;
import android.view.View;

/**
 * Created by Machwam on 15.01.2016.
 */
public class MenuCanvasView extends View {


    int arrow = 0;
    private Paint zeichenfarbe = new Paint();



    public MenuCanvasView(Context context) {
        super(context);
    }

    public MenuCanvasView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public MenuCanvasView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }

    public void init(){
        zeichenfarbe.setAntiAlias(true);
        zeichenfarbe.setColor(Color.rgb(131,173,183));
        zeichenfarbe.setStyle(Paint.Style.STROKE);
        zeichenfarbe.setStrokeWidth(7);
    }

    public void showAnimation(int i){
        arrow = i;
        invalidate();
    }

    @Override
    protected void onDraw(Canvas canvas){
        Path pfad = new Path();

        /*
        int hoehe = canvas.getHeight();
        int breite = canvas.getWidth();
        */

        switch (arrow){
            case 1:
                //Pfeil Hoch
                pfad.moveTo(129,86);
                pfad.lineTo(160,34);
                pfad.lineTo(191,86);
                canvas.drawPath(pfad,zeichenfarbe);

                arrow = 0;
                this.postInvalidateDelayed(200);
                break;
            case 2:
                //Pfeil runter
                pfad.moveTo(129,239);
                pfad.lineTo(159,292);
                pfad.lineTo(191,239);
                canvas.drawPath(pfad,zeichenfarbe);

                arrow = 0;
                this.postInvalidateDelayed(250);
                break;
            default:
                break;
        }


    }


}
