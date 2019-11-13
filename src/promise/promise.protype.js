if (typeof Promise) {
    if(!Promise.map){
        Promise.map = function(promiseList){
            let result = [];
            return promiseList.reduce(
                function(prev, current, index){
                    return prev.then(function(){
                        return current().then(_ret=>{
                            result[index] = _ret;
                        })
                    })
                },
                Promise.resolve()
            ).then(function(){
                return result;
            })
        };
    }
}