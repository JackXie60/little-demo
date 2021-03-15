import {
    Dep
} from "./dep";

let uid = 0
export class Watcher {
    /**
     * 
     * @param {观察的目标对象} target 
     * @param {观察的目标对象的响应表达式} expression 
     * @param {触发的回调函数} callback 
     */
    constructor(target, expression, callback) {
        console.log("这是一个依赖");
        this.id = uid++;
        this.target = target;
        this.getter = parsePath(expression);
        this.callback = callback;
        this.value = this.get()
    }
    update() {
        this.run();
    }
    run() {
        this.getAndInvoke(this.callback);
    }
    getAndInvoke(cb) {
        let value = this.get();
        if (value !== this.value || typeof value === "object") {
            const oldValue = this.value;
            this.value = value;
            cb.call(this.target, value, oldValue)
        }
    }
    //依赖收集阶段
    //将当前的唯一全局Dep设置为当前的watcher实例
    //触发要监听的数据的getter函数
    //触发相关getter之后进行dep.depend添加依赖到dep中
    get() {
        Dep.target = this;
        const obj = this.target;
        let value;
        try {
            value = this.getter(obj);
        } finally {
            Dep.target = null;
        }
        return value;
    }
}

function parsePath(exp) {
    var expArr = exp.split(".");
    console.log(expArr)
    return function (obj) {
        return expArr.reduce((initObj, curValue) => {
            if (!initObj) return;
            return initObj[curValue];
        }, obj)
    }
}