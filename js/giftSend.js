const easyvk = require('easyvk');
const sleep = require('util').promisify(setTimeout);
var vku;
var admin = "-65723219";

var uauch = {
    username: '89261717921',//'89214192055',//
    password: 'sSdrtN2h7o3GJOt',//'Katjav2003703123456789',//
    api_v: '5.95',
    lang: ["ru"][0],
    // debug: myDebugger
};

var Auch = async function () {

    try{
        vku = await easyvk(uauch); 
    }catch(err){console.log('giftSend.Vk.uauch, ошибка! ' + JSON.stringify(err));}
    console.log(vku);
    //ownerid = vku.session.group_id; //"65723219";
    return "giftSend.VkUAuch.ok";
};

var gsend = async function(uid, giftID, mess) {
    var random = getRandomInt(0, 1000000); 
    try{
        var {vkr} = await vku.call("gifts.send", {user_ids: uid,gift_id: giftID,guid: random,message: mess,privacy_view: 'all',confirm:"1"});        
        console.log(vkr[0]);
        msend(admin,"Подарок отправлен пользователю: https://vk.com/id"+uid);
    }catch (err) {
        console.log("giftSend.ERROR1: "+err); 
        if (err.error_code == 17){msend(admin,"Недостаточно голосов для отправки подарка пользователю: https://vk.com/id"+uid)}
        else(msend(admin,"Возникла ошибка при попытке отправки подарка пользователю: https://vk.com/id"+uid+" "+JSON.stringify(err)));   
        return 0;
    };
    return 0;

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