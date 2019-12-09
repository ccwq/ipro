const randomDic = new Map();
import $GBK from "../base/$GBK";

export default class StringUtils {
    /**
     * 使用字符串的第一个字母大写
     * @param first
     * @param rest
     * @returns {string}
     */
    static firstLetterUppercase(string){

        if(string === 0){
            return "0"
        }

        if (string === false) {
            return "False";
        }


        if (!string) {
            return "";
        }
        let [first, ...rest] = string;
        return first.toUpperCase() + rest.join('');
    } ;


    /**
     * 产生一个不重复的字符串
     * @returns {string}
     */
    static random(){
        let ret =  Math.random().toString(32).substr(2);
        if(randomDic.get(ret)){
            return StringUtils.random();
        }
        randomDic.set(ret, true);
        return ret;
    }


    /**
     * 从不可读转为中文
     * @param str 可以传入 %aa%af, ["aa", "af"], "aa,af"三种类型的字符串
     * @returns {undefined}
     */
    static decodeGBK(hexInfo){
        return $GBK.decode(hexInfo);
    }


    /**
     * 通hex数组转换为可读中文字符串
     * @returns {*}
     */
    static fromGBKArray(array){
        return $GBK.decode(array);
    }

    /**
     * 从每一项都是二进制数字的数组读取字符串
     * @param array 数组，每一项为1字节(Byte)信息(正好可以用两个16进制数字表示)
     * @param encodingType 编码方式 默认 uft-8,也可以是gbk等，参考 @link:https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/TextDecoder
     * @param base 如果数组的每一项为字符串，在转换数字时，所认为的进制
     */
    static fromArray(array, encodingType="utf-8", base=16){
        if(encodingType.toLowerCase() == "gbk" && base==16){
            return StringUtils.decodeGBK(array);
        }

        return new TextDecoder(encodingType)
            .decode(
                new Uint8Array(
                    array.map(n=>{
                        if (Number.isFinite(n)) {
                            return n
                        }else{
                            return parseInt(n, base)
                        }
                    })
                )
            )
        ;
    }


    /**
     * 文本转GBK的十六进制数组
     *  可读到不可读
     * @param string
     * @param outtype stinrg|array
     */
    static encodeGBK(cnString, outtype="string"){
        if (outtype == "string") {
            return $GBK.encode(cnString);
        }else{
            return $GBK.encode(cnString).split("%").splice(1);
        }
    }
}