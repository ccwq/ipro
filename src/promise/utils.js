export const promiseMap = function(promiseList){
    let result = [];
    return promiseList.reduce(
        function(prev, current, index){
            return prev.then(function(){
                return (typeof current === "function"?current():current).then(_ret=>{
                    result[index] = _ret;
                })
            })
        },
        Promise.resolve()
    ).then(function(){
        return result;
    })
}