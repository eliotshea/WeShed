import React, {Component} from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import App from './App';
import Login from './Login';
import Home from './Home';
import Auth from './Auth';

const Router = (props) => (
    <Switch>
	  <Route exact path='/' component={Login}/>
      <Route exact path='/Login' component={Login}/>
      <PrivateRoute path="/Home" component={Home} />
	  
    </Switch>
)

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      Auth.getAuth() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/"
          }}
        />
      )
    }
  />
);


export default Router;