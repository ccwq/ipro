/**
 * 异形Promise，暴露resolve,resolve在外的Promise
 */
export default class extends Promise{
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