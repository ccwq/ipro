const { encode, decode } = require('fast-gbk');

export default class $GBK {
    /**
     * 编码gbk字符串
     * @param str
     */
    static encode(str) {
        return encode(str);
    }

    /**
     * 解码gbk字符串
     * @param data 可以传入 %aa%af, ["aa", "af"], "aa,af"三种类型的字符串
     * @returns {undefined}
     */
    static decode(data) {
        if (!data || !data.length) {
            return "";
        }

        if (typeof data == "string") {
            if (/^\%/.test(data)) {
                data = data.split("%").splice(1)
            }else{
                data = data.split(",");
            }
        }


        if(Array.isArray(data)){
            if (typeof data[0] == "number") {
                return decode(data);
            }else{
                return $GBK.decode(data.map(n => {
                    let ret = parseInt(n, 16)
                    if (isNaN(ret)) {
                        return 0
                    }else {
                        return ret;
                    }
                }));
            }
        }
    }
}

