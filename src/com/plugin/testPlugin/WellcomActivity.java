package com.plugin.testPlugin;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.Window;
import android.view.WindowManager;

public class WellcomActivity extends Activity {
    int time = 1;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setStatus();
        setContentView(getResources().getIdentifier("activity_wellcom", "layout", getPackageName()));
    }

    private void setStatus() {
        Window window = getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
        int flag = WindowManager.LayoutParams.FLAG_FULLSCREEN;
        window.setFlags(flag, flag);
    }

    private CountDownTimer timer = new CountDownTimer(time * 1000, 1000) {

        @Override
        public void onTick(long millisUntilFinished) {
        }

        @Override
        public void onFinish() {
            setResult(Activity.RESULT_OK);
            startActivity(new Intent(WellcomActivity.this, FirstStartActivity.class));
            finish();
        }
    };

    @Override
    protected void onResume() {
        super.onResume();
        timer.start();
    }

    @Override
    protected void onPause() {
        super.onPause();
        timer.cancel();
    }

}
