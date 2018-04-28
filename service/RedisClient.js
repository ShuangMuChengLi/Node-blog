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
    client
};
