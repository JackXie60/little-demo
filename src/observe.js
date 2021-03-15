//对对象进行监听,
import {Observer} from "./Observer"
export function observe(value){
    //判断监听的对象类型是不是数组或者对象
    if(typeof value !== "object"){
        return;
    }
    //为对象的每一层添加observer
    var ob;
    if(value.__ob__!==undefined){
        ob=value.__ob__;
    }else{
        ob=new Observer(value);
    }
    return ob;
}