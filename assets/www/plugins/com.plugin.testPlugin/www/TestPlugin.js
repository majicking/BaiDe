cordova.define("com.plugin.testPlugin.TestPlugin", function(require, exports, module) {
var exec = require('cordova/exec');
function TestPlugin() {
}
TestPlugin.prototype.test = function(arg0,arg1, success, error) {
    exec(success, error, 'TestPlugin', 'test', [arg0,arg1]);
                          };
var testPlugin = new TestPlugin();
module.exports = testPlugin;
});
