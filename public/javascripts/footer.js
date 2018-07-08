var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?cead55fbf2c3f6a69ce901efea3e56e7";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();
axios.get("/music?begin=1&count=100").then(function (res){
    let data = res.data.data[0];
    var musicList = [];
    for(var i = 0; i < data.length ; i ++){
        musicList.push({
            name: data[i].title,
            singer:  data[i].singer,
            src: data[i].url,
        })
    }
    musicComp(musicList);
});

