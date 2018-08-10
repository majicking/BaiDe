package com.plugin.testPlugin;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.support.annotation.Nullable;
import android.support.v4.view.ViewPager;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.majick.baide.MainActivity;
import com.majick.baide.R;
import com.majick.baide.SharePreferenceUtils;

import java.util.ArrayList;

public class FirstStartActivity extends Activity {
    private ArrayList<ImageView> list_path;
    private Boolean isFirst;
    TextView textView;
    Button start;
    private int time = 4;
    private ViewPager mIn_vp;
    private CountDownTimer timer;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setstatus();
        isFirst = (Boolean) SharePreferenceUtils.getParam(this, "isfirst", false);

        if (isFirst) {
            setContentView(getResources().getIdentifier("activity_advertisement", "layout", getPackageName()));
            textView = findViewById(getResources().getIdentifier("time", "id", getPackageName()));
            textView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    setResult(Activity.RESULT_OK);
                    Intent intent = new Intent(FirstStartActivity.this, MainActivity.class);
                    startActivity(intent);
                    finish();
                }
            });
            timer = new CountDownTimer(time * 1000, 1000) {
                @Override
                public void onTick(long millisUntilFinished) {
                    textView.setText("跳过 " + (millisUntilFinished / 1000) + "s");
                }

                @Override
                public void onFinish() {
                    textView.setVisibility(View.GONE);
                    setResult(Activity.RESULT_OK);
                    Intent intent = new Intent(FirstStartActivity.this, MainActivity.class);
                    startActivity(intent);
                    finish();
                }
            }.start();
        } else {
            SharePreferenceUtils.setParam(this, "isfirst", true);
            setContentView(getResources().getIdentifier("firtstart_latout", "layout", getPackageName()));
            initView();
        }

    }

    private void setstatus() {
        //        獲取系統對象
        Window window = getWindow();
        //設置狀態欄全屏
        window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        //設置底部全屏
        window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
        int flag = WindowManager.LayoutParams.FLAG_FULLSCREEN;
        //设置当前窗体为全屏显示
        window.setFlags(flag, flag);
        //需要设置这个标志才能调用setStatusBarColor来设置状态栏颜色
//        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
//        //設置狀態欄透明色
//        window.setStatusBarColor(getResources().getColor(android.R.color.holo_red_dark));
//        //設置底部狀態欄全屏
//        window.setNavigationBarColor(getResources().getColor(android.R.color.holo_green_light));
//        //設置佈局全屏
//        window.clearFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
    }

    private LinearLayout mIn_ll;
    private ImageView mLight_dots;
    private int mDistance;
    private ImageView mOne_dot;
    private ImageView mTwo_dot;
    private ImageView mThree_dot;

    private void addDots() {
        mOne_dot = new ImageView(this);
        mOne_dot.setImageResource(R.drawable.gray_dot);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        layoutParams.setMargins(0, 0, 40, 0);
        mIn_ll.addView(mOne_dot, layoutParams);
        mTwo_dot = new ImageView(this);
        mTwo_dot.setImageResource(R.drawable.gray_dot);
        mIn_ll.addView(mTwo_dot, layoutParams);
        mThree_dot = new ImageView(this);
        mThree_dot.setImageResource(R.drawable.gray_dot);
        mIn_ll.addView(mThree_dot, layoutParams);
    }

    private void initView() {
        //放图片地址的集合
        mIn_vp = (ViewPager) findViewById(R.id.in_viewpager);
        mIn_ll = (LinearLayout) findViewById(R.id.in_ll);
        mLight_dots = (ImageView) findViewById(R.id.iv_light_dots);
        list_path = new ArrayList<ImageView>();
        addDots();
        mLight_dots.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                //获得两个圆点之间的距离
                mDistance = mIn_ll.getChildAt(1).getLeft() - mIn_ll.getChildAt(0).getLeft();
                mLight_dots.getViewTreeObserver().removeOnGlobalLayoutListener(this);
            }
        });
        start = (Button) findViewById(getResources().getIdentifier("start", "id", getPackageName()));
        start.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setResult(Activity.RESULT_OK);
                Intent intent = new Intent(FirstStartActivity.this, MainActivity.class);
                startActivity(intent);
                finish();
            }
        });
        //放标题的集合
        ImageView imageView1 = new ImageView(this);
        ImageView imageView2 = new ImageView(this);
        ImageView imageView3 = new ImageView(this);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        imageView1.setScaleType(ImageView.ScaleType.FIT_XY);
        imageView2.setScaleType(ImageView.ScaleType.FIT_XY);
        imageView3.setScaleType(ImageView.ScaleType.FIT_XY);
        imageView1.setLayoutParams(params);
        imageView2.setLayoutParams(params);
        imageView3.setLayoutParams(params);
        Glide.with(this).load(getResources().getIdentifier("wel1", "drawable", getPackageName())).into(imageView1);
        Glide.with(this).load(getResources().getIdentifier("wel2", "drawable", getPackageName())).into(imageView2);
        Glide.with(this).load(getResources().getIdentifier("wel3", "drawable", getPackageName())).into(imageView3);

//        imageView1.setBackgroundResource();
//        imageView2.setBackgroundResource(getResources().getIdentifier("wel2", "drawable", getPackageName()));
//        imageView3.setBackgroundResource(getResources().getIdentifier("wel3", "drawable", getPackageName()));
        list_path.add(imageView1);
        list_path.add(imageView2);
        list_path.add(imageView3);
        mIn_vp = (ViewPager) findViewById(R.id.in_viewpager);
        mIn_vp.setAdapter(new ViewPagerAdatper(list_path));
        mIn_vp.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
                //页面滚动时小白点移动的距离，并通过setLayoutParams(params)不断更新其位置

                if (position == 2) {
                    start.setVisibility(View.VISIBLE);
                }
                if (position != 2 && start.getVisibility() == View.VISIBLE) {
                    start.setVisibility(View.GONE);
                }
            }

            @Override
            public void onPageSelected(int position) {
//
//                float leftMargin = mDistance * (position );
//                RelativeLayout.LayoutParams params = (RelativeLayout.LayoutParams) mLight_dots.getLayoutParams();
//                params.leftMargin = (int) leftMargin;
//                mLight_dots.setLayoutParams(params);

                if (position == list_path.size()) {
                    start.setVisibility(View.VISIBLE);
                } else {
                    start.setVisibility(View.GONE);
                }

                //页面跳转时，设置小圆点的margin
                float leftMargin = mDistance * position;
                RelativeLayout.LayoutParams params = (RelativeLayout.LayoutParams) mLight_dots.getLayoutParams();
                params.leftMargin = (int) leftMargin;
                mLight_dots.setLayoutParams(params);

            }

            @Override
            public void onPageScrollStateChanged(int state) {

            }
        });


    }


    @Override
    protected void onPause() {
        super.onPause();
        if (timer != null) {
            timer.cancel();
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK){
         if (timer != null) {
                timer.cancel();
                Intent intent = new Intent(FirstStartActivity.this, MainActivity.class);
                startActivity(intent);
                finish();
                return true;
            }
        }
        return super.onKeyDown(keyCode, event);
    }
}
