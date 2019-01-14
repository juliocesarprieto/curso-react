import React from 'react';
import ReactDOM from 'react-dom';
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import App from './App';
import { BrowserRouter as Router, Route, Switch , Link} from 'react-router-dom';
import Login from './componentes/Login';


ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={Login}/>
      <Route path="/timeline" component={App}/>
    </Switch>      
  </Router>,
  document.getElementById('root')
);
