const lisenters = [];
export default class ListenersManager{
    constructor(){

    }
    addListen(listen){
        if(typeof listen !== "function"){
            throw TypeError("listen must be a function")
        }
        lisenters.push(listen);
        return ()=>{
            const index = lisenters.indexOf(listen);
            lisenters.splice(index,1);
        }
    }
    triggerListeners(location,action){
        lisenters.forEach(listen=>{
            listen(location,action)
        })
    }
}