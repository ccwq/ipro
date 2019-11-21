/**
 * 安全的绑定方法到原型上
 * @param prototype
 * @param key
 * @param value
 */
export const safeBindToObject = function(prototype, key, value){
    if (!prototype[key]) {
        prototype[key] = value;
    }

    if (!prototype["_" + key]) {
        prototype["_" + key] = value;
    }

    if (!prototype["__" + key]) {
        prototype["__" + key] = value;
    }
}

