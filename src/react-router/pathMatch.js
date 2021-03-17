import {pathToRegexp} from "path-to-regexp";


//如果没有匹配成功返回undifined
//匹配成功返回一个对象
export function pathMatch(path,pathname,options){
    const keys = [];
    const result = pathToRegexp(path,keys,getOptions(options))
    const matchResult = result.exec(pathname);
    if(!matchResult){
        return;
    }
    const matchArr = Array.from(matchResult);
    const params = getParams(matchArr.slice(1),keys);
    return {
        params,
        path,
        url:matchArr[0],
        isExact:pathname===matchArr[0]
    }
}
function getOptions(options){
    const defaultOptions = {
        sensitive:false,
        strict:false,
        exact:true,
    };
    const opts = {...defaultOptions,...options};
    return {
        sensitive:opts.sensitive,
        strict:opts.strict,
        end:opts.exact,
    }
}
function getParams(matchArr,keys){
    const obj = {};
    matchArr.forEach((matchParma,index)=>{
        obj[keys[index].name] = matchParma;
    })
    return obj;
}