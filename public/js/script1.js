
window.onload = function () {

   VK.init(function () {
   }, function () {
      alert("NO logi");
   }, '5.95');

}

function addkey() {
      VK.callMethod("showGroupSettingsBox", 0);
}

function addwidget() {
VK.callMethod('showAppWidgetPreviewBox', 'text', 'return {\
   "title": "Цитата",\
   "text": "Текст цитаты"\
};');
}
