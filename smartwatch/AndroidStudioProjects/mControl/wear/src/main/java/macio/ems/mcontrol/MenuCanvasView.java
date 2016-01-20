package macio.ems.mcontrol;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.util.AttributeSet;
import android.view.View;


public class MenuCanvasView extends View {


    int arrow = 0;
    private Paint zeichenfarbe = new Paint();

    int ani = -1;



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
        zeichenfarbe.setColor(Color.rgb(0,73,90));
        zeichenfarbe.setStyle(Paint.Style.STROKE);
        zeichenfarbe.setStrokeWidth(6);
    }

    public void showAnimation(int i){
        arrow = i;
        ani = 0;
        invalidate();
    }

    @Override
    protected void onDraw(Canvas canvas){
        Path pfad = new Path();

        /*
        int hoehe = canvas.getHeight();
        int breite = canvas.getWidth();
        */
        if(ani > 100){
            ani = -1;
            arrow = 0;
        }

        if(ani >= 0){

            switch (arrow){
                case 1:
                    //Pfeil Hoch
                    pfad.moveTo(133,86 - ani);
                    pfad.lineTo(160,38 - ani);
                    pfad.lineTo(187,86 - ani);
                    canvas.drawPath(pfad, zeichenfarbe);

                    ani += 4;
                    this.postInvalidateDelayed(1);
                    break;
                case 2:
                    //Pfeil runter
                    pfad.moveTo(133,239 + ani);
                    pfad.lineTo(159,288 + ani);
                    pfad.lineTo(187,239 + ani);
                    canvas.drawPath(pfad, zeichenfarbe);

                    ani += 4;
                    this.postInvalidateDelayed(1);
                    break;
                default:
                    break;
            }
        }
    }


}
