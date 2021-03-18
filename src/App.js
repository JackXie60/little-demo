import BrowersRouter from "./react-router/BrowersRouter";
import {Route} from "./react-router/index"
import {Switch} from "./react-router"
function comp({history,location}){
  return <div>
      <button onClick={()=>{history.push("/page1")}}>去page1</button>
      <button onClick={()=>{history.push("/page2")}}>去page2</button>
  </div>
}
function App() {
  return (
    <BrowersRouter >
        <Switch>
          <Route path="/page1" render={()=>"page1"}></Route>
          <Route path="/page2" render={()=>"page2"}></Route>
          <Route path="/" component={comp}></Route>
        </Switch>
    </BrowersRouter>
  );
}

export default App;
