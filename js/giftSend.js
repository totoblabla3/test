const easyvk = require('easyvk');
const sleep = require('util').promisify(setTimeout);
var vku;
var admin = "65723219";

var uauch = {
    username: '89232285123',
    password: '825226aa',
    api_v: '5.95',
    lang: ["ru"][0],
    // debug: myDebugger
};

var Auch = async function () {

    try{
        vku = await easyvk(uauch); 
    }catch(err){console.log('giftSend.Vk.uauch, ошибка! ' + err);}

    //ownerid = vku.session.group_id; //"65723219";
    return "giftSend.VkUAuch.ok";
};

var gsend = async function(uid, giftID, mess) {
    var random = getRandomInt(0, 1000000); 
    try{
        var {vkr} = await vku.call("gifts.send", {user_ids: uid,gift_id: giftID,guid: random,message: mess,privacy_view: 'all'});        
        console.log(vkr[0]);
        msend(admin,vkr[0]);
    }catch (err) {console.log("giftSend.ERROR1: "+err); msend(admin,err); return 0;};

}

var msend = async function(id, mess) {
    var random = getRandomInt(0, 1000000); 
    try{
        var {vkr} = await vkgroup.call('messages.send', {peer_id: id,message: mess,random_id: random});       
    }catch (err) {console.log("giftSend.ERROR2: "+err); return 0;};
    

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

module.exports.giftSendAuch = Auch;
module.exports.gSend = gsend;