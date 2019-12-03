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
    static fromGBKArray(){
        return new TextDecoder('gbk').decode(new Uint8Array(labelLs[0].splice(2).map(n=>parseInt(n, 16))))
    }
}