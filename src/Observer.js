import {def} from "../util/utils.js"
import { arrayMethods } from "./arrayMethods.js";
import { defineReactive } from "./defineReactive.js"
import { Dep } from "./dep.js";
import { observe } from "./observe.js";
//观察者Observer
export class Observer{
    constructor(value){
        this.dep = new Dep();
        //为要观察的对象身上绑定一个__ob__绑定当前的观察者实例
        def(value,"__ob__",this,true);
        //不是对象，将数组的原型设置为改写后的数组方法，改写后的数组方法被监听
        if(Array.isArray(value)){
            Object.setPrototypeOf(value,arrayMethods);
            this.observeArray(value);
        }else{
            //是对象
            this.walk(value);
        }
    }
    //循环遍历所有子元素，为所有的子元素添加观察者对象
    walk(value){
        for(let key in value){
            if(key!=="__ob__"){
                console.log(key)
                defineReactive(value,key);
            }
        }
    }
    //对数组的每一项进行监听
    observeArray(arr){
        for(let i = 0;i< arr.length;i++){
            observe(arr[i]);
        }
    }
}