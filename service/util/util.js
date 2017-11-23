module.exports = {
    /**
     * 计算分页信息
     * @param count
     * @param now
     * @param pageSize
     * @returns {{
     * next
     * prev
     * pageCount
     * now
     *
     * }}
     */
    page(count,now,pageSize){
        let result = {

        };
        let pageCount = Math.ceil(count/pageSize);
        if(now === pageCount){
            result.next = null;
        }else{
            result.next = now + 1;
        }
        if(now === 1){
            result.prev = null;
        }else {
            result.prev = now - 1;
        }
        result.now = now;
        result.pageSize = pageSize;
        result.pageCount = pageCount;
        return result;
    }
};
