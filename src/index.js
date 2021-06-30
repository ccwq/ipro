
//日期
import DateUtils from "./date/DateUtils";
import "./date/date.prototype";
import $D from "./date/date-prototype";

import ObjectUtils from "./object/ObjectUtils";

import "./collect/array.prototy"

import StringUtils from "./string/StringUtils";
import NumberUtils from "./number/NumberUtils";
import "./string/string.prototype"

export * from "./number/NumberUtils";

//promise
import "./promise/promise.protype";
import BPromise from "./promise/BPromise";

//错误
import AError from "./error/AError";


//function的prototype修改
import "./function/function.prototype";

let ipro = {
    StringUtils,
    DateUtils,
    $D,
    BPromise,
    AError,
    NumberUtils,
    ObjectUtils,
};

export default ipro;