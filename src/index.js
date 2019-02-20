import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Landing from './components/Landing';
import Home from './components/Home';
import ProjectPage from './components/ProjectPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import * as serviceWorker from './serviceWorker';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className='w-100 h-100'>
          <Switch>
            <Route exact path='/' component={Landing} />
            <Route
              exact
              path={
                '/:type(chemical|topic|location|researcher|time|method)?/:selection'
              }
              component={Home}
            />
            <Route exact path={'/projects/:slug'} component={ProjectPage} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
