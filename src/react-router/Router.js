import React from "react";
import ctx from "./routerContext";
import PropTypes from "prop-types"
import { pathMatch } from "../react-router-dom/pathMatch";
export default class Router extends React.Component{
    static PropType={
        history:PropTypes.object.isRequired,
        children:PropTypes.node,
    }
    state = {
        location:this.props.history.location,
    }
    componentDidMount(){
        this.unListen = this.props.history.listen((location,action)=>{
            this.props.history.action = action;
            this.setState({
                location,
            })
        })
    }
    componentWillUnmount(){
        this.unListen();
    }
    render(){
        const ctxValue = {};
        ctxValue.history = this.props.history;
        ctxValue.location = this.state.location;
        ctxValue.match = pathMatch("/",this.state.location.pathname)
        return <ctx.Provider value={ctxValue}>
            {this.props.children}
        </ctx.Provider>
    }
}