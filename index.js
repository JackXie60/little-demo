const PENDING = "pending",
    RESOLVE = "resolve",
    REJECT = "reject",
    PromiseStatus = Symbol("promiseStatus"),
    PromiseValue = Symbol("PromiseValue"),
    changeStatus = Symbol("changeStatus"),
    thenables = Symbol("thenables"),
    linkPromise = Symbol("linkPromise"),
    settlePromise = Symbol("settlePromise"),
    catchables = Symbol("catchables");
class MyPromise {
    [changeStatus](data, status, queue) {
        if (this[PromiseStatus] !== PENDING) {
            return;
        }
        this[PromiseStatus] = status;
        this[PromiseValue] = data;
        queue.forEach(fn => fn(data));
        if (typeof handler !== "function") {
            return;
        }
    }
    constructor(executor) {
            this[thenables] = [];
            this[catchables] = [];
            this[PromiseStatus] = PENDING;
            this[PromiseValue] = undefined;
            const resolve = (data) => {
                this[changeStatus](data, RESOLVE, this[thenables]);
            }
            const reject = (reson) => {
                this[changeStatus](reson, REJECT, this[catchables]);
            }
            try {
                executor(resolve, reject);
            } catch (err) {
                reject(err)
            }
        }
        [linkPromise](thenable, catchable) {
            return new MyPromise((resolve, reject) => {
                this[settlePromise](RESOLVE, (data) => {
                    try {
                        const result = thenable(data);
                        if (result instanceof MyPromise) {
                            result.then(d => {
                                resolve(d);
                            }, err => {
                                reject(err);
                            })
                        } else {
                            resolve(result)
                        }
                    } catch (err) {
                        reject(err);
                    }
                }, this[thenables]);
                this[settlePromise](REJECT, (data) => {
                    try {
                        const result = catchable(data);
                        result.then(d => {
                            resolve(d);
                        }).catch(err => {
                            reject(err);
                        })
                        resolve(result)
                    } catch (err) {
                        reject(err);
                    }
                }, this[catchables]);
            })
        }
        [settlePromise](status, fn, queue) {
            if (typeof fn !== "function") {
                return;
            }
            if (this[PromiseStatus] === status) {
                setTimeout(() => {
                    fn(this[PromiseValue]);
                }, 0);
            } else {
                queue.push(fn);
            }
        }
    then = (thenable, catchable) => {
        return this[linkPromise](thenable, catchable);
    }
    catch = (catchable) => {
        return this[linkPromise](undefined, catchable);
    }
    //全部resolve返回所有resolve的结果，其中只要有一个为reject返回这个reject的值
    static all(proms) {
        return new MyPromise((resolve, reject) => {
            const results = proms.map(p => {
                let obj = {
                    result: undefined,
                    isResolved: false,
                };
                p.then(data => {
                    obj.result = data;
                    obj.isResolved = true;
                    const unresolvedArr = results.filter(obj => !obj.isResolved);
                    if (unresolvedArr.length === 0) {
                        resolve(results.map(item => item.result));
                    }
                }).catch(err => {
                    reject(err)
                })
                return obj;
            })
        })
    }
    static race() {

    }
    static resolve(data) {
        if (data instanceof MyPromise) {
            return data;
        }
        return new MyPromise((resolve, reject) => {
            resolve(data);
        })
    }
    static reject(data) {
        return new MyPromise((resolve, reject) => {
            reject(data);
        })
    }
}