package com.plugin.testPlugin;

import android.Manifest;
import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Handler;
import android.os.Message;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.v4.content.ContextCompat;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.widget.Toast;

import com.plugin.testPlugin.plugin.android.CaptureActivity;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import static android.app.Activity.RESULT_OK;

/**
 * This class echoes a string called from JavaScript.
 */
public class TestPlugin extends CordovaPlugin {
    CallbackContext callbackContext;
    private static final int REQUEST_CODE_SCAN = 0x0000;
    private static final int REQUEST_CODE_BEGAIN = 0x0001;
    private static final String DECODED_CONTENT_KEY = "codedContent";
    private static final String DECODED_BITMAP_KEY = "codedBitmap";
    private static final String ERROR_INFO = "error";
    private CordovaPlugin cordovaPlugin;
    private Activity context;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        cordovaPlugin = this;
        context = cordova.getActivity();
        this.callbackContext = callbackContext;
        if (action.equals("test")) {
            String message = args.getString(0);
            String message1 = args.getString(1);
            this.test(message, message1, callbackContext);
            return true;
        }
        return false;
    }

    private static final int REQUEST_PERMISSION_CAMERA_CODE = 1;

    private void test(String message, String message1, CallbackContext callbackContext) {
        if (message != null && message.length() > 0) {
            if ("startapp".equals(message)) {
                Intent intent = new Intent(context, WellcomActivity.class);
                cordova.startActivityForResult(cordovaPlugin, intent, REQUEST_CODE_BEGAIN);
                return;
            } else if ("scanner".equals(message)) {
                if (getAndroidSDKVersion() >= 23) {
                    // 保持Activity处于唤醒状态
                    if (!(ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED)) {
                        cordova.requestPermissions(cordovaPlugin, REQUEST_PERMISSION_CAMERA_CODE, new String[]{Manifest.permission.CAMERA});
                    } else {
                        StartScanner();
                    }
                } else {
                    StartScanner();
                }
            } else if ("devices".equals(message)) {
                callbackContext.success(Settings.Secure.getString(this.cordova.getActivity().getContentResolver(), android.provider.Settings.Secure.ANDROID_ID));
            } else if ("copy".equals(message)) {
                //获取剪贴板管理器：
                ClipboardManager cm = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
                // 创建普通字符型ClipData
                ClipData mClipData = ClipData.newPlainText("Label", message1);
                // 将ClipData内容放到系统剪贴板里。
                cm.setPrimaryClip(mClipData);
                callbackContext.success("复制成功");
            }
        }
    }

    @Override
    public void onRequestPermissionResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) throws JSONException {
        super.onRequestPermissionResult(requestCode, permissions, grantResults);
//        Log.i("msg", "requestCode=" + requestCode + "  permissions=  " + Arrays.asList(permissions) + "  grantResults=" + Arrays.asList(grantResults));
        if (requestCode == REQUEST_PERMISSION_CAMERA_CODE) {
            if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                StartScanner();
            } else {
                Toast.makeText(context, "拒绝相机权限", Toast.LENGTH_SHORT).show();
            }
        }
    }

    Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            isGoing = false;
        }
    };
    public boolean isGoing = false;

    private void StartScanner() {
        if (!isGoing) {
            isGoing = true;
            Intent intent = new Intent(context, CaptureActivity.class);
            cordova.startActivityForResult(cordovaPlugin, intent, REQUEST_CODE_SCAN);
            handler.sendEmptyMessageDelayed(0, 2000);
        } else {
            Toast.makeText(context, "相机正在启动,请稍后", Toast.LENGTH_SHORT).show();
        }
    }

    public static int getAndroidSDKVersion() {
        int version = 0;
        try {
            version = Integer.valueOf(android.os.Build.VERSION.SDK);
        } catch (NumberFormatException e) {
            Log.i("MSG", e.toString());
        }
        return version;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_CODE_SCAN && resultCode == RESULT_OK) {
            if (data != null) {
                String content = data.getStringExtra(DECODED_CONTENT_KEY);
//                Bitmap bitmap = data.getParcelableExtra(DECODED_BITMAP_KEY);
                String error = data.getStringExtra(ERROR_INFO);
                if (content != null && !"".equals(content) && content.length() > 0) {
                    callbackContext.success(content);
                } else if (error != null && !"".equals(error) && error.length() > 0) {
                    callbackContext.error(error);
                }
            }
        } else if (requestCode == REQUEST_CODE_BEGAIN && resultCode == RESULT_OK) {
            callbackContext.success();
        }
    }


}
