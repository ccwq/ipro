import StringUtils from "./StringUtils";

const p =  String.prototype;



if(p.firstLetterUppercase){
    /**
     * 使第一个字母大写
     * @returns {string}
     */
    p.firstLetterUppercase = function(){
        return StringUtils.firstLetterUppercase(this);
    }
}
