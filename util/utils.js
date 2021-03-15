/**
 * 
 * @param {监听对象} data 
 * @param {监听键} key 
 * @param {键的值} val 
 * @param {是否可以枚举} enumerable 
 */
export function def(data,key,value,enumerable){
    Object.defineProperty(data,key,{
        value,
        enumerable,
        writable:true,
        configurable:true,
    })
}