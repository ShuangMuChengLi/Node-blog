/**
 * Created by lin on 2017/6/26.
 */
(function () {
    var storageUtil = {
        /**
         * 根据键值获取sessionStorage
         * @param key 键
         * @returns 失败false,成功对象
         */
        getSession (key){
            if(typeof(Storage)!=="undefined" || typeof key !== "string")
            {
                var value = sessionStorage.getItem(key);
                try {
                    value = JSON.parse(value);
                }catch (e){

                }
                return value;
            } else {
                return false;
            }
        },
        /**
         * 设置sessionStorage
         * @param key 键
         * @param value 值   String或者JSON或者ARRAY
         * @returns {boolean}
         */
        setSession(key , value){
            if(typeof(Storage)!=="undefined" || typeof key !== "string")
            {
                if(typeof value !== "string"){
                    value = JSON.stringify(value);
                }
                sessionStorage.setItem(key,value);
                return true;
            } else {
                return false;
            }
        },
        /**
         * 移除sessionStorage
         * @param key
         * @returns {boolean}
         */
        removeSession(key){
            if(typeof(Storage)!=="undefined" || typeof key !== "string")
            {
                sessionStorage.removeItem(key);
                return true;
            } else {
                return false;
            }
        },
        /**
         * 清空所有
         * @returns {boolean}
         */
        clearSession(){
            if(typeof(Storage)!=="undefined" )
            {
                sessionStorage.clear();
                return true;
            } else {
                return false;
            }
        },
        /**
         * 根据键值获取localStorage
         * @param key 键
         * @returns 失败false,成功对象
         */
        getLocalStorage (key){
            if(typeof(Storage)!=="undefined" || typeof key !== "string")
            {
                var value = localStorage.getItem(key);
                try {
                    value = JSON.parse(value);
                }catch (e){

                }
                return value;
            } else {
                return false;
            }
        },
        /**
         * 设置localStorage
         * @param key 键
         * @param value 值   String或者JSON或者ARRAY
         * @returns {boolean}
         */
        setLocalStorage(key , value){
            if(typeof(Storage)!=="undefined" || typeof key !== "string")
            {
                if(typeof value !== "string"){
                    value = JSON.stringify(value);
                }
                localStorage.setItem(key,value);
                return true;
            } else {
                return false;
            }
        },
        /**
         * 移除localStorage
         * @param key
         * @returns {boolean}
         */
        removeLocalStorage(key){
            if(typeof(Storage)!=="undefined" || typeof key !== "string")
            {
                localStorage.removeItem(key);
                return true;
            } else {
                return false;
            }
        },
        /**
         * 清空所有localStorage
         * @returns {boolean}
         */
        clearLocalStorage(){
            if(typeof(Storage)!=="undefined" )
            {
                localStorage.clear();
                return true;
            } else {
                return false;
            }
        }
    };
    if(typeof module !== "undefined"){
        module.exports = storageUtil;
    }
    if(typeof window !== "undefined"){
        window.storageUtil = storageUtil;
    }
})();
