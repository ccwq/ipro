import crawl from "tree-crawl";


/**
 * 安全的绑定方法到对象上
 * @param prototype
 * @param key
 * @param value
 */
export const safeBindToObject = function(prototype, key, value){
    if (!prototype[key]) {
        prototype[key] = value;
    }

    if (!prototype["_" + key]) {
        prototype["_" + key] = value;
    }

    if (!prototype["__" + key]) {
        prototype["__" + key] = value;
    }
}

/**
 * 遍历树
 * @param treedata
 * @param childrenField
 * @param stepCallback
 */
export const treeEach = function(treedata, childrenField, stepCallback){

    if (Array.isArray(treedata)) {
        treedata = {[childrenField]: treedata}
    }
    crawl(
        treedata,
        stepCallback,
        {
            getChildren(node) {
                return node[childrenField];
            }
        }
    )
    return treedata;
}