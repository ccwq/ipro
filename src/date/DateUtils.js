import $D from "date-prototype";

export default class DateUtils{

    /**
     * 转换各种类型的数据到天气
     * @param input number
     * @returns {Date|*}
     */
    static parse2date(input) {

        //数字或者字符串时间戳
        if (typeof input == "number" || /^\d+$/.test(input + "")) {

            //4标识是年
            if(input.length === 4){
                let a = new Date;
                a.setFullYear(input * 1);
                return a;

            //其他情况，自求多福
            }else{
                return new Date(input * 1);
            }

            //空对象
        } else if (!input) {
            return new Date();

            //日期对象
        }else if (input.constructor == Date) {
            return input;
        }
        //日期字符串
        var parts = input.split(/[-:\sTZ\+年月日时分秒]/);


        //只有年月的情况2018-06
        if (parts.length == 2) {
            parts[2] = 1;
        }

        return new Date(parts[0], parts[1] - 1, parts[2], parts[3] || 0, parts[4] || 0, parts[5] || 0);
    }



    static getDayMountByMonth(month){
        const m = this;
        var dateStr = "";
        if (typeof month == "string") {
            let splited = month.split("-");
            if (splited.length == 1) {
                month = parseInt(month)
            }else if(splited.length==2){
                dateStr = month + "-01"
            }else{
                dateStr = month
            }
        }else if(typeof month == "number"){
            //什么都不做
        }else{
            throw new Error("请传入有效类型")
        }


        var d;
        if (dateStr) {
            d = $D(dateStr);
        }else{
            d = new Date();
            d.setMonth(month-1);
        }

        return m.getDayMount(d);
    }

    /**
     * 获取当前月份的的天数
     * @param date 各种日期类型的数据
     * @returns {number}
     */
    getDayLengthInMonth(date) {
        date = parse2date(date).clone();
        date.add(1,"month");
        date.setDate(0);
        return date.getDate();
    }
}