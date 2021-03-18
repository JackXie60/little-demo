import ctx from "./routerContext"

function withRouter(Comp){
    function routerWrapper(props){
        return <ctx.Consumer>
            {value=>{
                <Comp {...props} {...value}/>
            }}
        </ctx.Consumer>
    }
    routerWrapper.displayName = `withRouter(${Comp.displayName||Comp.name})`;
    return routerWrapper;
}
export default withRouter;