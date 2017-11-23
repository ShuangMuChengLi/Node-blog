const assert = require("chai").assert;
describe("async-test", function() {
    it("parallel", function(done) {
        const parallel = require("../../../service/util/async").parallel;
        let console = require("console");
        let fn1 = function () {
            let promise = new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    resolve(1);
                },3000);
            });
            return promise;
        };
        let fn2 = function () {
            let promise = new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    resolve(2);
                },1000);
            });
            return promise;
        };
        let fn3 = function () {
            let promise = new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    resolve(3);
                },2000);
            });
            return promise;
        };
        parallel([fn1,fn2, fn3]).then((data)=>{
            console.log(data);
            done();
        }).catch((err)=>{
            console(err);
            done();
        });
    });
});
