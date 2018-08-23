let hyhHttp = require("hyh-http");
let _ = require("lodash");
let area = require("../json/area");
let logDao = require("../dao/logDao");
async function main() {
    let result = await logDao.selectViewIP();
    // result = result.slice(0,50);
    let total = result.length;
    let cursor = 0;
    let count = 0;
    async function requireArea(ip) {
        count++;
        if(count < 100 && cursor < total - 1){
            cursor++;
            requireArea(result[cursor].ip)
        }
        let data = await new hyhHttp("http://ip-api.com/json/" + ip)
            .get()
            .then((data)=>{
                try {
                    data = JSON.parse(data);
                }catch (e){
                    data = null;
                }
                return data;
            })
            .catch((e)=>{
                return false;
                console.error(e);
            });
        if(data){
            data.ip = ip;
            logDao.updateLog(data);
        }
        count--;
        cursor++;
        if(cursor < total - 1){
            requireArea(result[cursor].ip)
        }
        console.log(cursor,total - cursor);
    }
    requireArea(result[cursor].ip);
}

main();
