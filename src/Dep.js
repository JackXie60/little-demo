let uid = 0;
//在Dep中可以通过depend收集这些依赖，在notify中通知更新(当属性被设置或者使用数组的方法)
export class Dep{
    constructor(){
        //所有的订阅者
        this.subs=[];
        this.is=uid++;
        // console.log("这是一个Dep的构造器")
    }
    //通知更新
    notify(){
        console.log(this.subs)
        var subs = this.subs.slice();
        for(var i =0;i<subs.length;i++){
            subs[i].update();
        }
    }
    //添加订阅
    addSub(sub){
        this.subs.push(sub);
    }
    //添加依赖，将watcher实例放在全局唯一的Dep.target上
    depend(){
        if(Dep.target){
            this.addSub(Dep.target);
        }
    }
}