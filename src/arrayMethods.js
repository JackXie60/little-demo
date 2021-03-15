import { def } from "../util/utils";

const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);
const arrMethods = [
    "pop",
    "push",
    "shift",
    "unshift",
    "splice",
    "reverse",
    "sort",
]
arrMethods.forEach(methodName=>{
    const original = arrayProto[methodName];
    def(arrayMethods,methodName,function(){
        var ob = this.__ob__;
        var args = [...arguments];
        const result = original.apply(this,args);
        //将被插入到数组的值进行监听
        let inserted = [];
        switch (methodName) {
            case "push":
            case "unshift":
                inserted = args;
                break;
            case "splice":
                inserted = args.slice(2);
                break;
        }
        if(inserted){
            ob.observeArray(inserted);
        }
        ob.dep.notify();
        return result;
    },false)
})
