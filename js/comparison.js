var comparison = function (newArr,oldArr){
    var idx = 0, arr3 = [];
    for (var i = 0; i < newArr.length; i++)
        {
          idx = oldArr.findIndex(e => e.uid === newArr[i].uid);
          if (idx == -1) arr3.push(newArr[i]);
        } 
    return arr3;
   }

module.exports.comparison = comparison;