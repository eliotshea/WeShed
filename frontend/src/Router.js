import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Songs from './Songs';
import Profile from './Profile';
import Register from './Register';
import Auth from './Auth';

const Router = (props) => (
    <Switch>
	  <Route exact path='/' component={Login}/>
	  <Route exact path='/Register' component={Register}/>
      <Route exact path='/Login' component={Login}/>
      <PrivateRoute path="/Home" component={Home} />
	  <PrivateRoute path="/Songs" component={Songs} />
	  <PrivateRoute path="/Profile" component={Profile} />
    </Switch>
)

//Referenced https://github.com/TarakeshS/protected-routes/blob/master/src/Router.js
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