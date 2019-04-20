var i = 0;
var toi =10;
window.onload=function(){ 

VK.init(function() {
	
  }, function() {
     alert("NO");
}, '5.95');

}

function addkey(){
VK.callMethod("showGroupSettingsBox", 64);	
}

function title1(){
 VK.callMethod('showAppWidgetPreviewBox', 'text', 'return {\
    "title": "Привет",\
    "text": "'+new Date()+'"\
};');
}

 function title1update(){

 VK.api("appWidgets.update", {
    "title": "Привет",
    "text": new Date(),
    "v":"5.73"
}, 'text' ,function (data) {alert(data.response)});

if (toi>i) {
	setTimeout(title1update(), 11000);
		i++	
	}
}

//VK.api("wall.post", {"message": "Hello!", "v":"5.73"}, function (data) {
//    alert("Post ID:" + data.response.post_id); 
//});