
//日期
import DateUtils from "./date/DateUtils";
import "./date/date.prototype";
import $D from "date-prototype";


import StringUtils from "./string/StringUtils";
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
};


export default ipro;