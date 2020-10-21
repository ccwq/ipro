import {safeBindToObject} from "../baseUtil";
import {promiseMap} from "./utils";

if (typeof Promise) {
    /**
     * 串行执行promise
     */
    safeBindToObject(Promise, "map", promiseMap);
}