import get from "lodash/get";

//是否是undefined或者null
import isNil from "lodash/isNil";



/**
 * 尝试获取对象的多个属性(支持深度获取属性),直到获取到某个非零的属性值
 * @param object 要获尝试获取属性的对象
 * @param keyLs  要尝试获取的属性序列，可以是都好分隔的字符串，
 * @param defaultValue 属性列表依次尝试仍然失败，返回的值
 * @param isUseNil 使用lodash的isNil来做空判断
 * @returns {*}
 */
const __get = function(object, keyLs, defaultValue, useIsNil){
    if (typeof keyLs === "string") {
        keyLs = keyLs.split(",")
    }

    if (!Array.isArray(keyLs)) {
        return ;
    }

    let ret;
    for (let i = 0; i < keyLs.length; i++) {
        let key = keyLs[i];
        ret = get(object, key);

        if (ret) {
            return ret;
        }
    }

    return defaultValue;
}

export default class ObjectUtils {

    /**
     * 尝试获取对象的多个属性(支持深度获取属性),直到获取到某个非零的属性值
     * @param object 要获尝试获取属性的对象
     * @param keyLs  要尝试获取的属性序列，可以是都好分隔的字符串，
     * @param defaultValue 属性列表依次尝试仍然失败，返回的值
     * @returns {*}
     */
    static get(object, keyLs, defaultValue) {
        return __get(object, keyLs, defaultValue, false);
    }

    /**
     * 同上，除了null和undefined都认为字段存在值
     * @param object
     * @param keyLs
     * @param defaultValue
     * @returns {*}
     */
    static get2(object, keyLs, defaultValue) {
        return __get(object, keyLs, defaultValue, true);
    }

}
