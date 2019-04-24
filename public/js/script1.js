var i = 0;
var toi = 10;
window.onload = function () {

   VK.init(function () {
     // alert("NO");
   }, function () {
      alert("NO logi");
   }, '5.95');

}

function addkey() {

      VK.callMethod("showGroupSettingsBox", 4096);
   
}

function title1() {
   VK.callMethod('showAppWidgetPreviewBox', 'text', 'return {\
    "title": "Привет",\
    "text": "' + new Date() + '"\
};');
}

function title1update() {

   VK.api("appWidgets.update", {
      "title": "Привет",
      "text": "qq",
      "type": "text",
      "v": "5.73",
      "access_token": token
   }, function (data) {
      document.getElementById("text1").textContent = data.error.error_msg
   })
} ////new Date()

//if (toi>i) {
//setTimeout(title1update(), 11000);
//		i++	
//}


//VK.api("wall.post", {"message": "Hello!", "v":"5.73"}, function (data) {
//    alert("Post ID:" + data.response.post_id); 
//});