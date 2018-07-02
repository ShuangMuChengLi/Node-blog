var redis = require("redis"),
    bluebird = require("bluebird");
let redisConfig = require("../config/redis-config");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
let client = redis.createClient();
if(redisConfig.sessionStore.pass){
    client.auth(redisConfig.sessionStore.pass);
}
client.on("error",(err)=>{
    console.log(err)
});
module.exports = {
    client
};
