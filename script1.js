window.onload=function(){ 

VK.init(function() {
  }, function() {
     alert("NO");
}, '5.95');

}

function post(){
VK.api("wall.post", {"message": "Hello!", "v":"5.73"}, function (data) {
    alert("Post ID:" + data.response.post_id); 
});
}

function title1(){
VK.callMethod('showAppWidgetPreviewBox', 'text', 'return {\
    "title": "Привет",\
    "text": "Я родился"\
};');
}