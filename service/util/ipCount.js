var redis = require("redis"),
    bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
let client = redis.createClient();
client.auth("g7845120");
client.on("error",(err)=>{
    console.log(err)
});
module.exports = {
    async addIpCount(ip,ex) {
        ex = ex || 60;
        let count  = await client.getAsync(ip);
        count = count || 0;
        await client.setAsync(ip,++count,"ex",ex);
        return true;
    },
    async getIpCount(ip){
        let count  = await client.getAsync(ip);
        return count;
    }
};




























































