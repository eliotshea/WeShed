
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import './App.css';
import Auth from './Auth';

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
		
        fetch("http://localhost:4000/auth", {
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
			localStorage.setItem('acess_token', response.token);
			alert(localStorage['acess_token']);
			//Get auth relies on requesting decrypting from back end-- back end responds, appearingly in time?
			if(Auth.getAuth())
				alert("race condition? getAuth() ret true");
			else
				alert("race condition? getAuth() ret false")
			
        }).catch(function(err) {
            console.log(err)
        });

  }
  
  getToken(){
	  alert(localStorage['acess_token']); 
  }
  
  async getAuthStatus(){
	  var x = await Auth.getAuth();
	  var y = await Auth.getAuth();
	  return x;
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

	
	if (this.state.toHome === true) {
	  alert("triggered redirect to home");
      return <Redirect to='/Home' />
    }

    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>

          <label>User Name</label>
          <input type="text" data-test="username" value={this.state.username} onChange={this.handleUserChange} />

          <label>Password</label>
          <input type="password" data-test="password" value={this.state.password} onChange={this.handlePassChange} />

          <input type="submit" value="Log In" data-test="submit" />
        </form>
		<div>
		<button onClick={this.getToken}>
			getToken
		</button>
		<button onClick={this.getAuthStatus}>
			getAuthStatus
		</button>
		</div>
		
		<div>
		<button onClick={Auth.signout()}>
			Logout
		</button>
		</div>
		
      </div>
	  
	  
    );
  }
}

export default Login;




