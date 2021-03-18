import React from "react";
import {
    pathMatch
} from "../react-router-dom/pathMatch";
import ctx from "../react-router/routerContext"
export default class Route extends React.Component {
    static defaultProps={
        path:"/"
    }
    // 有以下属性
    // path 
    // children
    // render
    // component

    // sensitive
    // exact
    // strict

    //用来根据location设置match
    matchPath = (location) => {
        const {
            sensitive=false,
            exact=false,
            strict=false,
        } = this.props
        return pathMatch(this.props.path, location.pathname, {
            sensitive,
            exact,
            strict
        })
    }
    //ctx.provide中的值(根据属性不同设置)
    //当有children时，使用children的内容
    //当有render时，render返回的内容
    //当有component时，component的内容
    RouteChildren(ctx) {
        if(this.props.children){
            if(typeof this.props.children === "string"){
                return this.props.children;
            }else if(typeof this.props.children === "function"){
                return this.props.children(ctx);
            }
        }
        if(!ctx.match){
            return null;
        }
        if(this.props.render){
            return this.props.render(ctx)
        }
        if(this.props.component){
            const Com = this.props.component;
            return <Com {...ctx}/>
        }
    }
    render() {
        return <ctx.Consumer > 
            {value=>{
                const ctxValue = {};
                ctxValue.history = value.history;
                ctxValue.location = value.location;
                ctxValue.match = this.matchPath(value.location);
                return <ctx.Provider value={ctxValue}>
                    {this.RouteChildren(ctxValue)}
                </ctx.Provider>
            }}
            </ctx.Consumer>
    }
}