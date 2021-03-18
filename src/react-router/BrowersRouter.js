import React from "react"
import Router from "./Router"
import createBrowerHistory from "../react-router-dom/history"
export default class BrowersRouter extends React.Component{
    history = createBrowerHistory(this.props);
    render(){
        return (<Router history={this.history}>
            {this.props.children}
        </Router>)
    }
}