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
}