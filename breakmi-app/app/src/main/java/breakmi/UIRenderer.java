package breakmi;

import android.app.Activity;
import android.widget.TextView;

import java.util.UUID;

public class UIRenderer {

    static void renderEavesdropping(final UUID uuid, final String descr, final String value, final Activity activity) {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                TextView textScrollingEavesdropping = (TextView) activity.findViewById(R.id.textScrollingEavesdropping);
                textScrollingEavesdropping.setText("Characteristic " + uuid.toString().substring(4,8) + " >>> " + descr + value + "\n" + textScrollingEavesdropping.getText());
            }
        });
    }

    static void renderAppImpersonation(final String descr, final Activity activity) {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                TextView textScrollingAppimp = (TextView) activity.findViewById(R.id.textScrollingAppimp);
                textScrollingAppimp.setText(descr + "\n" + textScrollingAppimp.getText());
            }
        });
    }

    static void renderAppImpersonationSuccess(final String descr, final int color, final Activity activity) {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                TextView textAppimpSuccess = (TextView) activity.findViewById(R.id.textAppimpSuccess);
                textAppimpSuccess.setText(descr);
                textAppimpSuccess.setTextColor(color);
            }
        });
    }

}
