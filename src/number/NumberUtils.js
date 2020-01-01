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
}