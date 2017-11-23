module.exports = {
    parallel(fns){
        let promise = new Promise((resolve,reject)=>{
            let successCount = 0;
            let resultArray = [];
            fns.map((fn, index)=>{
                fn().then((data)=>{
                    successCount++;
                    resultArray[index] = data;
                    if(successCount === fns.length){
                        resolve(resultArray);
                    }
                })
                    .catch((err)=>{
                        reject(err);
                    });
            });
        });
        return promise;
    }
};
