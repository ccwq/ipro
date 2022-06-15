/**
 * 为树形数据建立索引,已便于向上查找父节点
 * @param treeData
 * @param childrenKey
 * @returns {{}}
 */
const makeTreeDataHelper = function(treeData, options = {}) {

    // 原始节点的字典
    let originNodeIndexes = {};

    // 原始节点列表
    let allOriginNodes = [];

    // 镜像节点镜像列表
    let allMirrorNodes = [];
    let mirrorNodeIndexes = {};

    // 重置缓存数据 originNodeIndexes allOriginNodes allMirrorNodes mirrorNodeIndexes
    const resetConstData = function(){
        originNodeIndexes = {};
        allOriginNodes = [];
        allMirrorNodes=[];
        mirrorNodeIndexes=  {};
    }
    resetConstData();

    let {
        childrenKey = "children",
        checkedKey = "checked",
        idKey = "id",
    } = options;
    let index = 0

    // 所有存在的节点中最大的深度
    let maxDepth = 0

    // 修改options
    const setOptions = function (options = {}) {
        childrenKey = options.childrenKey || childrenKey
        checkedKey = options.checkedKey || checkedKey
        idKey = options.idKey || idKey
    };

    const traverse = function(data, parent) {
        data.forEach(function(item) {
            const id = item[idKey]
            originNodeIndexes[id] = item;
            item = {...item};
            allMirrorNodes.push(item);
            item.parent = parent
            item.index = index++
            const deepth = parent ? parent.deepth + 1 : 0;
            item.deepth = deepth;
            maxDepth = Math.max(maxDepth, deepth)
            item.path = parent ? parent.path + '.' + item[idKey] : '0'
            item.parentIdList = parent ? [...parent.parentIdList, parent[idKey]] : [];
            mirrorNodeIndexes[id] = item
            if (item[childrenKey] && item[childrenKey].length > 0) {
                traverse(item[childrenKey], item)
            }
        })
    };

    const isNodeCheckedByChildren = function(node) {
        if (node[childrenKey] && node[childrenKey].length > 0) {
            const hasUnchecked = node[childrenKey].map(el => getNode(el[idKey])).find(item => !item[checkedKey]);
            return !hasUnchecked;
        } else {
            return false
        }
    }

    // 更新索引
    const updateIndexes = function(treeData) {

        resetConstData();

        // 如果是数组,设置虚拟根节点
        if (!Array.isArray(treeData)) {
            treeData = treeData[childrenKey];
        }
        traverse(treeData)
    };
    updateIndexes(treeData)

    // 获取父节点列表
    const getParents = function(id) {
        return getNode(id).parentIdList.map(id => getNode(id));
    }

    // 获取同级节点
    const getSublings = function(id) {
        const node = getNode(id)
        return allMirrorNodes.filter(function(item) {
            return item.parent === node.parent;
        })
    }

    // 获取镜像节点
    const getNode = function(id) {
        if (typeof id != "string") {
            id = get(id, idKey)
        }
        return mirrorNodeIndexes[id]
    }

    // 获取原始节点
    const getOriginNode = function(id) {
        if (typeof id != "string") {
            id = get(id, idKey)
        }
        return originNodeIndexes[id]
    }

    // 获取节点的深度
    const getDeepth = function(id) {
        const node = getNode(id)
        return node.deepth;
    }

    // 设置节点属性
    const setProps = function(id, props) {
        const item = getNode(id)
        if (item) {
            Object.assign(item, props);
        }
    }
    // 设置check状态
    const setChecked = function(id, checked, updateParentAndChildren = false) {
        const item = getNode(id)
        if (item) {
            item[checkedKey] = checked

            if (updateParentAndChildren) {
                // 设置父级
                item.parentIdList.forEach(id => {
                    const parent = mirrorNodeIndexes[id];
                    parent[checkedKey] = isNodeCheckedByChildren(parent)
                });

                // 设置子集
                travelNode(item, function(node) {
                    node[checkedKey] = checked;
                })
            }
        }
    }

    // 重置节点的选中状态,应用于编辑时
    const resetCheckStatus = function(checkedKeyList) {
        const dic = {};
        if (checkedKeyList) {
            checkedKeyList.forEach(item => {
                dic[item] = true;
            })
        }
        allMirrorNodes.forEach(item => {
            item[checkedKey] = dic[item[idKey]] || false;
        })
    }

    // 遍历一个节点以及所有子节点
    const travelNode = function(id, callback) {
        const node = getNode(id)
        callback(node)
        if (node[childrenKey] && node[childrenKey].length > 0) {
            node[childrenKey].forEach(function(item) {
                travelNode(item, callback)
            })
        }
    }

    // 获取所有节点中最浅的深度
    const getMinDeepth = function() {
        let minDeep = maxDepth
        for (const i in allMirrorNodes) {
            const node = allMirrorNodes[i]
            if (node.checked) {
                minDeep = Math.min(minDeep, node.deepth)
            }
            if (minDeep === 0) {
                return 0
            }
        }
        return minDeep
    }
    // 通过条件过滤节点
    const getNodeListByFilter = filter => allMirrorNodes.filter(filter);

    // 遍历所有节点
    const travelAllNode = function(callback) {
        for (const i in allMirrorNodes) {
            const node = allMirrorNodes[i]
            const oNode = getOriginNode(node[idKey])
            if (callback(node, oNode) === false) {
                break
            }
        }
    }

    return {
        travelNode,
        getNodeListByFilter,
        getMinDeepth,
        getSublings,
        getParents,
        getDeepth,
        getNode,
        updateIndexes,
        setChecked,
        setProps,
        travelAllNode,
        setOptions,
        resetCheckStatus,
        getOriginNode,
    }
}

export {
    makeTreeDataHelper
}
