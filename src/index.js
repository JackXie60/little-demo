import {observe} from "./observe"
import { Watcher } from "./Watcher";
var a = 10;
console.log(a);
var obj = {
    a:{
        m:{
            n:10
        }
    },
    b:{
        e:11
    },
    c:[11,2,22,33,4,44]
};
observe(obj);
// console.log(obj.c);
new Watcher(obj,"a.m.n",()=>{
    console.log("★★★★★")
});
// obj.c.push(1,2,3)
// obj.a.m.n = 66
obj.a.m = 12
// obj.c.push(1,2,3)
