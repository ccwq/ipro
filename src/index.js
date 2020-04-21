
//日期
import DateUtils from "./date/DateUtils";
import "./date/date.prototype";
import $D from "date-prototype";

import "./collect/array.prototy"

import StringUtils from "./string/StringUtils";
import NumberUtils from "./number/NumberUtils";
import "./string/string.prototype"

//promise
import "./promise/promise.protype";
import BPromise from "./promise/BPromise";

//错误
import AError from "./error/AError";

let ipro = {
    StringUtils,
    DateUtils,
    $D,
    BPromise,
    AError,
    NumberUtils,
};

export default ipro;