import React from 'react';
import ReactDOM from 'react-dom';
import './css/reset.css';
import './css/timeline.css';
import './css/login.css';
import App from './App';
import { Router, Route, browserHistory} from 'react-router';
import Login from './componentes/Login';
import Logout from './componentes/Logout';

function verificaAutenticacao(nextState, replace){  

  if (localStorage.getItem('auth-token') === null) {
      replace('/?msg=voce precisa estar logado para acessar');
  }
}

ReactDOM.render(
  <Router history = {browserHistory}>    
      <Route exact path="/" component={Login}/>
      <Route path="/timeline" component={App} onEnter={verificaAutenticacao}/>
      <Route path="/logout" component={Logout}/>         
  </Router>,
  document.getElementById('root')
);
