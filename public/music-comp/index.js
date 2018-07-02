function musicComp(musicList) {
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
    window.onload = function () {
        var musicIcon = document.getElementById("musicIcon");
        var music = document.getElementById("music");
        var musicSource = document.getElementById("musicSource");
        var musicRuning = false;
        var index = 0;
        var currentMusic = {
            name: "",
            singer: "",
            src: ""
        };
        function setSrc() {
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
                if(musicList[index].src){
                    src = musicList[index].src;
                }else{
                    src = musicList[index];
                }
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
            console.log("onerror");
            musicList.splice(index,1);
            if(musicRuning){
                setSrc();
                music.load();
                music.play();
            }else{
                setSrc();
                music.load();
            }

        };
        setSrc();
        music.load();

        musicIcon.addEventListener("click",function (e) {
            if(musicRuning){
                musicRuning = !musicRuning;
                this.setAttribute("class",  "music-icon animation animation-paused");
                music.pause();
            }else{
                musicRuning = !musicRuning;
                this.setAttribute("class",  "music-icon animation animation-runing");
                music.play();
            }
        });
        music.onpause =  function() {
            if(musicRuning){
                console.log("onpause");
                if(++index >=  musicList.length){
                    index = 0;
                }
                setSrc();
                music.load();
                music.play();
            }
        };
        // music.onended =  function() {
        //     console.log("onended");
        //     if(++index >=  musicList.length){
        //         index = 0;
        //     }
        //     setSrc();
        //     music.load();
        //     music.play();
        // };
    }
}
if (typeof module !== "undefined") {
    module.exports = musicComp;
}
if (typeof window !== "undefined") {
    window.musicComp = musicComp;
}