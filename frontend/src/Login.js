
import React, { Component } from 'react';
import './App.css';
import DI from './config/domain_info';
import Auth from './Auth';
import Cookies from 'js-cookie';
import logo from './weshedlogo.png';
import './loginpage.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';


class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    };

    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();


        var data = {
            username: this.state.username,
            password: this.state.password
        }

        fetch(DI.DOMAIN + "/auth", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(function(response) {
            if (response.status >= 400) {
              throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(response) {
			//Response from the verified /auth POST
			Cookies.set('mytoken', response.token, { expires: 14, domain: DI.DOMAIN_NAME}); //Create a cookie to expire in 2 weeks
			alert(response.token);

        }).catch(function(err) {
            console.log(err)
        });

  }

  getLogout(){
	  Auth.signout();
  }

  handleUserChange(evt) {
    this.setState({
      username: evt.target.value,
    });
  };

  handlePassChange(evt) {
    this.setState({
      password: evt.target.value,
    });
  }

  render() {

    return (
      <div className="App">
        <div className="background">
      <img src={logo} className="App-logo" alt="Logo" />
      <h1 className="welcome">
      Welcome to WeShed
      </h1>
      <div className="Login">
        <form onSubmit={this.handleSubmit}>

          <FormGroup>
          <label>User Name</label>
          <input type="text" data-test="username" value={this.state.username} onChange={this.handleUserChange} />
          </FormGroup>
          <FormGroup>
          <label>Password</label>
          <input type="password" data-test="password" value={this.state.password} onChange={this.handlePassChange} />
          </FormGroup>

          <input type="submit" value="Log In" data-test="submit" />
        <div className="text-ceenter"/>
          <a href="/Register" className="link">Sign up</a>
        </form>
		<div>
		<div>
		<button onClick={this.getLogout}>
			Logout
		</button>
		</div>
		</div>
    </div>
    </div>



      </div>


    );
  }
}

export default Login;
