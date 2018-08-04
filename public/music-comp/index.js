function musicComp(musicList) {
    var musicIcon = document.getElementById("musicIcon");
    var firstLoad = true;
    if(musicIcon){
        firstLoad = false;
    }
    if(firstLoad){
        var audioEle = document.createElement("audio");
        audioEle.id = "music";
        audioEle.setAttribute("class", "audio");
        audioEle.setAttribute("controls", "controls");
        audioEle.innerHTML = '<source src="" id="musicSource">';
        var aEle = document.createElement("a");
        aEle.setAttribute("href","javascript:void(0)");
        aEle.setAttribute("class","music-icon animation animation-paused");
        aEle.id = "musicIcon";
        document.body.appendChild(audioEle);
        document.body.appendChild(aEle);
        musicIcon = document.getElementById("musicIcon");
    }
    var music = document.getElementById("music");
    var musicSource = document.getElementById("musicSource");
    if(!firstLoad){
        musicIcon.setAttribute("class",  "music-icon animation animation-paused");
        music.pause();
    }
    var musicRuning = false;
    var index = 0;
    var currentMusic = {
        name: "",
        singer: "",
        src: ""
    };
    function play() {
        if(++index >=  musicList.length){
            index = 0;
        }
        if(musicList[index] ){
            setSrc(index);
            music.load();
            music.play();
        }else{
            console.error("")
        }
    }
    function setSrc(index) {
        if(musicList[index].src){
            currentMusic.src = musicList[index].src;
        }else{
            currentMusic.src = musicList[index];
        }
        musicSource.src = currentMusic.src;
        if(musicList[index].singer){
            currentMusic.singer = musicList[index].singer;
        }else{
            currentMusic.singer = "";
        }
        if(musicList[index].name){
            currentMusic.name = musicList[index].name;
        }else{
            var reg = /\/(\w+)\.\w+$/;
            var src = musicList[index];
            var fileName = src.match(reg)[1];
            currentMusic.name = fileName;
        }
        if(currentMusic.singer){
            musicIcon.title = currentMusic.name + " — " + currentMusic.singer;
        }else{
            musicIcon.title = currentMusic.name ;
        }
    }
    musicSource.onerror = function () {
        musicList.splice(index,1);
        play();
    };
    setSrc(index);
    music.load();

    musicIcon.addEventListener("click",function (e) {
        if(musicRuning){
            this.setAttribute("class",  "music-icon animation animation-paused");
            music.pause();
        }else{
            this.setAttribute("class",  "music-icon animation animation-runing");
            music.play();
        }
        musicRuning = !musicRuning;
    });
    music.onpause =  function() {
        if(musicRuning){
            if(++index >=  musicList.length){
                index = 0;
            }
            setSrc(index);
            music.load();
            music.play();
        }
    };
    musicComp.play = function () {
        musicIcon.setAttribute("class",  "music-icon animation animation-runing");
        music.play();
    }
}

if (typeof module !== "undefined") {
    module.exports = musicComp;
}
if (typeof window !== "undefined") {
    window.musicComp = musicComp;
}
