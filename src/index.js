import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
import Landing from "./components/Landing";
import Home from "./components/Home";
import ProjectPage from "./components/ProjectPage";
import Credits from "./components/Credits";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class App extends React.Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/credits" component={Credits} />
          <Route
            exact
            path={
              "/:type(chemical|topic|location|researcher|time|method|publications)?/:selection"
            }
            component={Home}
          />
          <Route exact path={"/projects/:slug"} component={ProjectPage} />
        </Switch>
      </HashRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
