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
}