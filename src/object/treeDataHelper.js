/**
 * 为树形数据建立索引,已便于向上查找父节点
 * @param treeData
 * @param childrenKey
 * @returns {{}}
 */
const treeDataHelper = function(treeData, childrenKey = 'children', checkedKey = 'checked') {
    const indexes = {}
    const allNodes = []
    let index = 0

    // 所有存在的节点中最大的深度
    let maxDepth = 0

    const _step_node = function(data, parent) {
        data.forEach(function(item) {
            item = {...item};
            allNodes.push(item);
            item.parent = parent
            item.index = index++
            const deepth = parent ? parent.deepth + 1 : 0;
            item.deepth = deepth;
            maxDepth = Math.max(maxDepth, deepth)
            item.path = parent ? parent.path + '.' + item.id : '0'
            item.parentIdList = parent ? [...parent.parentIdList, parent.id] : [];
            indexes[item.id] = item
            if (item[childrenKey] && item[childrenKey].length > 0) {
                _step_node(item[childrenKey], item)
            }
        })
    };

    const isNodeCheckedByChildren = function(node) {
        if (node[childrenKey] && node[childrenKey].length > 0) {
            const hasUnchecked = node[childrenKey].map(el => getNode(el.id)).find(item => !item[checkedKey]);
            return !hasUnchecked;
        } else {
            return false
        }
    }

    // 更新索引
    const updateIndexes = function(treeData) {
        // 如果是数组,设置虚拟根节点
        if (!Array.isArray(treeData)) {
            treeData = treeData[childrenKey];
        }
        _step_node(treeData)
    };
    updateIndexes(treeData)

    // 获取父节点列表
    const getParents = function(id) {
        const parentList = []
        let parent = indexes[id].parent
        while (parent) {
            parentList.push(parent)
            parent = parent.parent
        }
        return parentList
    }

    // 获取同级节点
    const getSublings = function(id) {
        const node = getNode()
        return allNodes.filter(function(item) {
            return item.parent === node.parent;
        })
    }

    const getNode = function(id) {
        return indexes[id]
    }

    // 获取节点的深度
    const getDeepth = function(id) {
        const node = getNode(id)
        return node.deepth;
    }

    // 设置节点属性
    const setProps = function(id, props) {
        const item = indexes[id]
        if (item) {
            Object.assign(item, props);
        }
    }
    // 设置check状态
    const setChecked = function(id, checked, updateParentAndChildren = false) {
        const item = indexes[id]
        if (item) {
            item[checkedKey] = checked

            if (updateParentAndChildren) {
                // 设置父级
                item.parentIdList.forEach(id => {
                    const parent = indexes[id];
                    parent[checkedKey] = isNodeCheckedByChildren(parent)
                });

                // 设置子集
                travelNode(item, function(node) {
                    node[checkedKey] = checked;
                })
            }
        }
    }

    // 遍历一个节点以及所有子节点
    const travelNode = function(id, callback) {
        const node = typeof id === "string" ? getNode(id) : getNode(id.id);
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
        for (const i in allNodes) {
            const node = allNodes[i]
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
    const getNodeListByFilter = filter => allNodes.filter(filter);

    // 遍历所有节点
    const travelAllNode = function(callback) {
        for (const i in allNodes) {
            const node = allNodes[i]
            if (callback(node) === false) {
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
        travelAllNode
    }
}

export {
    treeDataHelper
}
