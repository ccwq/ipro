const randomDic = new Map();

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
     * 从GBK数组转换为文本
     */

    /**
     * 从二进制数组转换为字符串
     * @param gbkArray
     * @param base
     * @param isFilter255 是否过滤掉值为255的项
     * @returns {string}
     */
    static fromGBKArray(gbkArray, base=16, isFilter255=false){
        return this.fromArray(gbkArray, "gbk", base);
    }


    //encoding type

    /**
     * 从每一项都是二进制数字的数组读取字符串
     * @param array 数组，每一项为1字节(Byte)信息(正好可以用两个16进制数字表示)
     * @param encodingType 编码方式 默认 uft-8,也可以是gbk等，参考 @link:https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/TextDecoder
     * @param base 如果数组的每一项为字符串，在转换数字时，所认为的进制
     */
    static fromArray(array, encodingType="utf-8", base=16){
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
     * 文本转GBK,Array
     * @param string
     */
    static toGBKByteArray(string){
        var str = $URL.encode(str)
        var byteArr = new Array();
        for(var i=0; i<str.length;i++){
            var ch = str.charAt(i);
            if(ch == '%'){
                var num = str.charAt(i+1) + str.charAt(i+2);
                num = parseInt(num,16);
                num = num | (-1 << 8);
                byteArr.push(num);
                i+=2;
            }else{
                byteArr.push(ch.charCodeAt());
            }
        }
        return byteArr;
    }
}