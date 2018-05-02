function fnGet(sQueryKey,sUrl) {
    sUrl = sUrl?sUrl:window.location.href;
    var aUrlPart = sUrl.split("?");
    var aGet = new Array();
    if (aUrlPart[1]) {
        var aGetPair = aUrlPart[1].split("&");
        for (var i = 0; i < aGetPair.length; i++) {
            var aTmpArr = aGetPair[i].split("=");
            var sKey = aTmpArr[0];
            aGet[sKey] = aTmpArr[1];
        }
    }
    if(typeof aGet[sQueryKey] !== "undefined" && aGet[sQueryKey]){
        return aGet[sQueryKey];
    }else{
        return false;
    }
}
var token = fnGet("token");
if(token){
    storageUtil.setSession("token", token);
}
