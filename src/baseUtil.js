import crawl from "tree-crawl/index.js";
import compact from "lodash/compact";
import {getValue} from "./object/ObjectUtils";


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


/**
 * 解析optionsls
 * @param options 带解析的内容
 * @param stringElSplit 在使用文本形式options时item之间分割的符
 * @param defaultLs 没有提供options时使用默认options
 * @param stringValueNameSplit 使用文本item时，用来分割value和name
 * @param nameField 使用object类型itme时name的字段
 * @param valueField 使用object类型item时value的字段
 * @returns {Promise<*>}
 */
export const all2valueName = function(
    options,
    stringElSplit = /\s+/,
    defaultLs = ["0,请提供options"],
    elFormatter,
    stringValueNameSplit=",",
    nameField="name",
    valueField="value",
    isDebug,
){
    let ls, _promise;

    //数组解析
    //是函数
    if (typeof options == "function") {
        _promise = options();

        //字符串的形式
    }if (typeof options == "string") {
        ls = options.split(stringElSplit).map(el=>el.trim());

        //是数组
    }else if(Array.isArray(options)){
        ls = options;

        //其他类型
    }else{
        if (Array.isArray(defaultLs)) {
            ls = defaultLs
        }else if(typeofdefaultLs == "function"){
            _promise = defaultLs();
        }else{
            ls = [{
                name:"请通过optionLs传入数组或者异步函数",
                value:-1,
            }]
        }
    }

    const handler = function (ls) {
        //处理formater
        if (typeof elFormatter == "function") {
            ls = ls.map((el) => {
                let [value, name] = elFormatter(el, {
                    valueField: valueField,
                    nameField: nameField,
                }, getValue);
                return {value, name};
            });
        }


        let _ls = compact(ls);

        if (_ls.length != ls.length) {
            console.warn("options中存在空选项", ls);
        }

        ls = _ls;

        //以数组为参数
        ls = ls.map(el => {

            const _el = el;

            //切割字符串
            if (typeof el == "string" || typeof el == "number") {
                el = (el + "").split(stringValueNameSplit).map(el => el.trim());
            }

            if (Array.isArray(el)) {
                let [value, name] = el;
                if (name === undefined) {
                    name = value;
                }
                return {value, name};
            } else if (!el) {
                return {
                    name: "无效options",
                    value: "-",
                }
            } else {
                return {
                    name: getValue(el, nameField),
                    value: getValue(el, valueField)
                }
            }
        });

        ls.forEach(el => {
            if (typeof el.value != Number && typeof el.value != Number) {
                el.value = el.value + "";
            }
        })
        return ls;
    };

    if (ls) {
        return handler(ls);
    }else{
        return _promise.then(ls => handler(ls));
    }
}
