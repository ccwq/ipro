export const promiseMap = function(promiseList){
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
                        return Promise.resolve(e);
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