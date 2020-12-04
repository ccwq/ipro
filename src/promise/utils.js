export const promiseMap = function(){
    let promiseList;
    if (Array.isArray(arguments[0])) {
        promiseList = arguments[0];
    }else{
        promiseList = Array.prototype.slice.call(arguments);
    }
    let result = [];
    return promiseList.reduce(
        function (prev, current, index, ls) {
            return prev.then(function () {
                if (typeof current === "function") {
                    try {
                        current = current();
                    } catch (e) {

                        //用来提前停止reduce
                        ls.splice(1);
                        return Promise.reject(e);
                    }
                }
                return current.then(_ret => {
                    result[index] = _ret;
                })
            })
        },
        Promise.resolve(result)
    ).then(function () {
        return result;
    });
}