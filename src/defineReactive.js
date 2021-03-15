import { Dep } from "./dep";
import { observe } from "./observe";

export function defineReactive(obj,key,val){
    //生成一个dep实例用来收集当前数据的watcher依赖，get时添加依赖，set时更新视图
    var dep = new Dep();
    if(arguments.length===2){
        val = obj[key];
    }
    let childNode = observe(val);
    Object.defineProperty(obj,key,{
        //可被枚举
        enumerable:true,
        //可被删除
        configurable:true,
        get(){
            console.log("对象属性被访问",key);
            if(Dep.target){
                dep.depend();
                if(childNode){
                    childNode.dep.depend();
                }
            }
            return val;
        },
        set(newValue){
            if(val === newValue){
                return;
            }
            console.log("对象属性被改写");
            val = newValue;
            childNode = observe(val);
            dep.notify();
        }
    })
}