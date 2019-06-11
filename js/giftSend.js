const easyvk = require('easyvk');
const sleep = require('util').promisify(setTimeout);
var vku;
var admin = "-65723219";

var uauch = {
    username: "89214192055",//'89232285123',
    password: "Katjav2003703123456789",//'825226aa',
    api_v: '5.95',
    lang: ["ru"][0],
    // debug: myDebugger
};

var Auch = async function () {

    try{
        vku = await easyvk(uauch); 
    }catch(err){console.log('giftSend.Vk.uauch, ошибка! ' + JSON.stringify(err));}

    //ownerid = vku.session.group_id; //"65723219";
    return "giftSend.VkUAuch.ok";
};

var gsend = async function(uid, giftID, mess) {
    var random = getRandomInt(0, 1000000); 
    try{
        var {vkr} = await vku.call("gifts.send", {user_ids: uid,gift_id: giftID,guid: random,message: mess,privacy_view: 'all',confirm:"1"});        
        console.log(vkr[0]);
        msend(admin,vkr[0]);
    }catch (err) {
        console.log("giftSend.ERROR1: "+err); 
        if (err.error_code == 17){msend(admin,"Недостаточно голосов для отправки подарка пользователю: https://vk.com/id"+uid)}
        else(msend(admin,"Возникла ошибка при попытке отправки подарка пользователю: https://vk.com/id"+uid+" "+JSON.stringify(err)));
         
        return 0;
    };

}

var msend = async function(id, mess) {
    var random = getRandomInt(0, 1000000); 
    try{
        var {vkr} = await vku.call('messages.send', {peer_id: id,message: mess,random_id: random});       
    }catch (err) {console.log("giftSend.ERROR2: "+err); return 0;};
    

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

module.exports.giftSendAuch = Auch;
module.exports.gSend = gsend;