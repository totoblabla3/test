
window.onload = function () {

   VK.init(function () {
   }, function () {
      alert("NO logi");
   }, '5.95');

}

function addkey() {
      VK.callMethod("showGroupSettingsBox", 4096);
}
