export default class NumberUtils {

    /**
     * 数字前面补0，凑够特定长度
     * @param totalLength 要凑够的长度
     * @param value 数字可以是数字，也可以是字符串。如果是字符串可能是非10进制数字，请使用第三方个参数来处理
     * @param base 进制，默认十进制
     */
    static preZeroFill(totalLength, value, base=10) {
        //value = parseFloat(value);
        let pad = totalLength - (value + "").length;
        if (pad <= 0) {
            return value;
        }
        return Array(pad).fill("0").join("") + (value + "")
    }


    /**
     * 截取js小数计算出现无限循环之外的部分
     * strip(0.2+0.1)==0.3
     * @param number
     * @param precision
     * @returns {number}
     */
    static strip(number, precision = 12) {
        if (typeof number != "number") {
            number = 0;
        }
        return +parseFloat(number.toPrecision(precision));
    }

    /**
     *
     * @param number
     * @param fixed
     */
    static stripAndFix(number, fixedNum=2){
        if (typeof number != "number") {
            number = 0;
        }
        return this.strip(number).toFixed(fixedNum) * 1;
    }
}


/**
 * 判断并返回值是否属于某个集合安全值
 * @param value
 * @param ls
 * @param def
 * @returns {number|*}
 */
export const safeValueInLs = function (value, ls, def = 0) {

    if (ls.includes(value)) {
        return value
    } else {
        if (typeof def == "number") {
            if (def == -1) {
                def = ls.length - 1;
            }
            return ls[def];
        } else {
            return def;
        }
    }

    return ls.includes(value) || def;
};


import Math2 from "./Math2";



/**
 * 数字范围安全安全值
 * @param value
 * @param min
 * @param max
 * @returns {number}
 */
export const safeValueInRange = function (value, max = Number.MAX_SAFE_INTEGER, min = 0) {
    const isHex = typeof value == "string"
    let ret = isHex ? Math2.toDEC(value) : value;
    if (typeof min == "number") {
        ret = Math.max(min, ret);
    }

    if (typeof max == "number") {
        ret = Math.min(max, ret);
    }

    return isHex ? Math2.toHEX(ret) : ret;
};