import Vue from "vue"

function forEach(obj, callBack) {
    Object.keys(obj).forEach(objKey => {
        callBack(objKey, obj[objKey])
    })
}
class ModuleCollection {
    constructor(options) {
        //格式化options配置,生成如下配置
        // {
        //     _raw:rootModule,
        //     state:rootModule.state,
        //     _children:[]
        // }
        this.register([], options);
    }
    register(path, rootModule) {
        let rawModule = {
            _raw: rootModule,
            state: rootModule.state,
            _children: []
        };
        if (!this.root) {
            this.root = rawModule;
        }else{
            const parentModule = path.slice(0,-1).reduce((rootModule,curModuleName)=>{
                return rootModule._children[curModuleName];
            },this.root)
            parentModule._children[path[path.length-1]] = rawModule;
        }
        if (rootModule.modules) {
            forEach(rootModule.modules, (moduleName, module) => {
                this.register(path.concat(moduleName), module);
            })
        }
    }
}
function installModules(store,rooState,path,rawModule){
    //设置state
    let state = rawModule.state;
    if(path.length>0){
        const parent = path.slice(0,-1).reduce((root,cur)=>{
            return root[cur]
        },rooState)
        Vue.set(parent,path[path.length-1],rawModule.state)
    }
    //设置getter
    let getters = rawModule._raw.getters;
    if(getters){
        forEach(getters,(getterName,value)=>{
            Object.defineProperty(store.getters,getterName,{
                get:()=>{
                    return value(state);
                }
            })
        })
    };
    let mutations = rawModule._raw.mutations;
    if(mutations){
        forEach(mutations,(mutationName,value)=>{
            store.mutations[mutationName] ||(store.mutations[mutationName] = []);
            store.mutations[mutationName].push((payload)=>{
                value(state,payload)
            })
        })
    }
    let actions = rawModule._raw.actions;
    if(actions){
        forEach(actions,(actionName,value)=>{
            store.actions[actionName] ||(store.actions[actionName] = []);
            store.actions[actionName].push((payload)=>{
                value(store,payload)
            })
        })
    }
    //遍历子孩子
    if(rawModule._children){
        forEach(rawModule._children,(childrenName,value)=>{
            rawModule = value;
            installModules(store,rooState,path.concat(childrenName),rawModule);
        })
    }
}
class Store {
    //将options中state转换为响应式
    constructor(options) {
        this.vm = new Vue({
            data: {
                state: options.state
            }
        });
        // let getters = options.getters;
        this.getters = {};
        this.mutations = {};
        this.actions = {};
        const moduleCollection = new ModuleCollection(options);
        const rawModule = moduleCollection.root;
        installModules(this,this.state,[],rawModule)
    }
    get state() {
        return this.vm.state;
    };
    commit = (mutationName, payload) => {
        this.mutations[mutationName].forEach(fn=>fn(payload))
    }
    dispatch = (actionName, payload) => {
        this.actions[actionName].forEach(fn=>fn(payload));
    }
}

function install(Vue) { //参数是vue的构造函数，使用Vue.use会默认执行install方法
    //为每个vue实例在创建之前混入$store属性
    Vue.mixin({
        beforeCreate() {
            //如果是根实例，那么在身上绑定$store,不是根实例，则查找父级身上的$store绑定到自己身上
            if (this.$options.store) {
                this.$store = this.$options.store
            } else {
                this.$store = this.$parent && this.$parent.$store
            }
        }
    })
}
export default {
    Store,
    install,
}