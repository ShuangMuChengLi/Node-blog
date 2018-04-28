let client = require("../RedisClient").client;
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




























































