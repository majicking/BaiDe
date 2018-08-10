cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "com.plugin.testPlugin.TestPlugin",
    "file": "plugins/com.plugin.testPlugin/www/TestPlugin.js",
    "pluginId": "com.plugin.testPlugin",
    "clobbers": [
      "cordova.plugins.TestPlugin"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "com.plugin.testPlugin": "1.0.0"
};
// BOTTOM OF METADATA
});