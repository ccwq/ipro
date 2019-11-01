/**
 * 支持直接定义错误码的Error对象
 * @type {RegExp}
 */
const errorCodeRG = /\:\:([-\d\.]+)$/

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
        const key = `${errText}-${silent ? '0' : '1'}`
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
        if (errorObj.data) {
            errorObj = errorObj.data
            try {
                errorObj = JSON.parse(errorObj)
            } catch (e) { /* console.log(); */ }
        }
        const name = errorObj.error || errorObj.message || errorObj.msg || errorObj.reason || errorObj.errorText || errorObj
        if (!silent) {
            silent = errorObj.silence || errorObj.silent
        }
        return m.fromErrorText(name, silent)
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

    /**
     * 展示错误信息
     * @param errorText_errorObject
     */
    static toast (errorText_errorObject) {
        const ins = AError.fromObject(errorText_errorObject)
        console.error(ins.toString2())
    }
}

const fromErrorTextCache = {}
