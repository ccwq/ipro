import {promiseMap} from "./utils";
import {safeBindToObject} from "ipro/src/baseUtil";


/**
 * 异形Promise，暴露resolve,resolve在外的Promise
 */
export default class BPromise extends Promise{
    static resolve(value){
        let p = new BPromise;
        p._resolve(value);
        return  p;
    }

    static reject(value){
        let p = new BPromise;
        p._reject(value);
        return  p;
    }


    static map(promiseLs){
        return promiseMap(promisLs);
    }

    static all(ls){
        return Promise.all(ls);
    }

    constructor(callback) {
        let _resolve, _reject;
        super((resolve, reject)=>{
            _resolve = resolve;
            _reject = reject;
            if (callback) {
                callback(resolve, reject);
            }
        });

        Object.assign(this, {
            _resolve,
            _reject,
        })
    }

    /**
     * 是否pending状态
     * @returns {boolean}
     */
    getPendingStatus(){
        let status = true;
        this.then(__ => status = false, __ => status = false);
        return status;
    }

    /**
     * 是否成功状态
     * @returns {boolean}
     */
    getFulfilledStatus(){
        let status = false;
        this.then(__ => status = true, __ => status = false);
        return status;
    }

    /**
     * 是否拒绝
     * @returns {boolean}
     */
    getRejectedStatus(){
        let status = false;
        this.then(__ => status = false, __ => status = true);
        return status;
    }
}
