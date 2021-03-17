export default class BlockManager{
    constructor(getUserConfirmation){
        this.promt = null;
        this.getUserConfirmation = getUserConfirmation;
    }
    block(promt){
        if(typeof promt !== "string"&&typeof promt !=="function"){
            throw TypeError("promt must be string or function");
        }
        if(promt){
            this.promt = promt;
            return ()=>{
                this.promt = null;
            }
        }
    }
    triggerBlock(location,action,callback){
        let message;
        if(typeof this.promt === "string"){
            message = this.promt;
        }else if(typeof this.promt === "function"){
            message = this.promt(location,action);
        }
        this.getUserConfirmation(message,result=>{
            //完成回调中的事情
            if(result===true){
                callback();
            }
        })
    }
}