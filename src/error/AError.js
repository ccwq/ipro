/**
 * 支持直接定义错误码的Error对象
 * @type {RegExp}
 */


//分隔符
const CODE_SPLITE = "::";

// ^
// | 上下关联需要同时修改
// v

//用来解析code的正则
const errorCodeRG = /\:\:([-\d\.]+)$/;

// todo: get code, toString设置全部无效

/**
 * 错误对象
 */
export default class AError {



    /**
     * @param name 错误名
     * @param code 错误码
     * @param silent 是否静默
     * @param resp 错误其他信息<a href=https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error>参考原生文档</a>
     */
    constructor (name, code, silent, ...resp) {
        const m = this
        m._name = name
        m._code = code
        m._silent = silent
    }

    /**
     * 设置安静状态
     * @param silent
     */
    // setSilent(silent){
    //     const m = this;
    //     m._silent = silent;
    // }

    /**
     * 错误信息
     * @returns {*}
     */
    get name () { return this._name }

    /**
     * 错误信息
     * @returns {*}
     */
    get message () { return this._name }

    /**
     * 错误信息
     * @returns {*}
     */
    get msg () { return this._name }

    /**
     * 错误码
     * @returns {*}
     */
    get code () { return this._code }
    get cod () { return this._code }

    /**
     * 错误码
     * @returns {*}
     */
    get errorCode () { return this._code }

    /**
     * 是否静默
     * @returns {*}
     */
    get silent () { return this._silent }

    /**
     * 是否静默
     * @returns {*}
     */
    get silence () { return this._silent }

    toString2 () {
        const m = this
        return `AError:${m.code}-${m.name}`
    }

    /**
     * 从字符串创建其他对象
     * @param errText 字符串
     */
    static fromErrorText (errText, silent = false) {
        const m = this
        const key = `${errText}-${silent ? '0' : '1'}`;
        let ins = fromErrorTextCache[key]
        if (!ins) {
            let code, name
            if (errorCodeRG.test(errText)) {
                code = RegExp['$1']
                name = errText.replace(`::${code}`, '')
            } else {
                code = 0
                name = errText
            }
            ins = new AError(name, code, silent)
            fromErrorTextCache[key] = ins
        }
        return ins
    }

    /**
     * 从潜在的错误信息对象创建/兼容fromErrorText
     * @param errorObj
     * @param silent
     * @returns {*}
     */
    static fromObject (errorObj, silent = false) {
        const m = this
        if (!errorObj) {
            return new AError('未知错误', -9999)
        }
        let message;

        //是错误对象
        if (errorObj instanceof Error) {
            return m.fromErrorText(errorObj.message, silent);
        }

        //可能是JSON
        if (/^(\[|\{)/.test(errorObj)) {

            //尝试解析JSON
            try {
                errorObj = JSON.parse(errorObj)
            } catch (e) { /* console.log(); */ }
        }

        //是否安静
        if (!silent) {
            silent = errorObj.silence || errorObj.silent;
        }

        if (typeof errorObj != "string") {
            message = getValue(errorObj, [...m.AddNameFieldList, ...m.NameFieldList]);
        }

        if (!message && errorObj.data) {
            return m.fromObject(errorObj.data);
        }

        return m.fromErrorText(message, silent);
    }


    /**
     * 第一个参数可以取所有支持的值
     * @param errObject
     * @param slient
     * @returns {AError}
     */
    static create(errObject, slient=false){
        return this.fromObject(errObject, slient);
    }

    /**
     * 从字符串/潜在包含错误信息对象中获取错误码
     * @param errorText_errorObject
     */
    static getErrorCode (errorText_errorObject) {
        if (!errorText_errorObject) {
            return 0
        }

        if (errorText_errorObject.constructor == AError) {
            return errorText_errorObject._code
        }

        return this.fromObject(errorText_errorObject)._code
    }
}


Object.assign(AError, {

    //猜测错误对象名称的字段
    NameFieldList : ["error", "message", "msg", "errMsg", "reason", "errorText"],

    //附加的猜测对象名称的字段
    AddNameFieldList: [],
})

const fromErrorTextCache = {};


/**
 * 根据传入的字段列表，尝试获取非空值，获取到值立即结束
 * @param object
 * @param keyLs
 * @param defaultValue
 * @returns {*}
 */
function getValue(object, keyLs, defaultValue){
    if (typeof keyLs === "string") {
        keyLs = keyLs.split(",").map(s => s.trim());
    }

    if (!Array.isArray(keyLs)) {
        return ;
    }

    for (let i = 0; i < keyLs.length; i++) {
        let key = keyLs[i];

        if(object[key]){
            return object[key];
        }
    }

    return defaultValue;
}



