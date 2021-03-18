import React from "react";
import { pathMatch } from "../react-router-dom/pathMatch";
import Route from "./Route";
import ctx from "./routerContext";

export default class Switch extends React.Component{
    matchChild({location}){
        let children = [];
        if(this.props.children){
            if(Array.isArray(this.props.children)){
                children = this.props.children;
            }
            else if(typeof this.props.children === "object"){
                children = [this.props.children];
            }
        }
        for(const child of children){
            if(child.type !== Route){
                throw TypeError("the children of Switch Component must be type of Route");
            }
            let {
                sensitive=false,
                strict=false,
                exact=false,
            } = child.props
            const result = pathMatch(child.props.path,location.pathname,{
                sensitive,
                strict,
                exact,
            });
            if(result){
                return child;
            }
        }
    }
    render(){
        return <ctx.Consumer>
            {value=>{
                return this.matchChild(value)
            }}
        </ctx.Consumer>
    }
}