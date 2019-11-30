import React, { Component } from 'react';
import './App.css';
import DI from './config/domain_info';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
	  email: '',
	  fname: '',
	  lname: ''
    };

    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
	this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlefnameChange = this.handlefnameChange.bind(this);
	this.handlelnameChange = this.handlelnameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(evt) {
    evt.preventDefault();
	

        var data = {
            username: this.state.username,
            password: this.state.password,
			email: this.state.email,
			fname: this.state.fname,
			lname: this.state.lname
        }
		
        fetch(DI.DOMAIN + "/register", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(function(response) {
            if (response.status >= 400) {
              throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(response) {
			//Response from the successful register
			if(response.success)
				alert("Successful register");
			else
				alert("Something went wrong");
			
        }).catch(function(err) {
            console.log(err)
        });

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
  handleEmailChange(evt) {
    this.setState({
      email: evt.target.value,
    });
  }
  handlefnameChange(evt) {
    this.setState({
      fname: evt.target.value,
    });
  }
  handlelnameChange(evt) {
    this.setState({
      lname: evt.target.value,
    });
  }

  render() {


    return (
      <div className="Register">
	  <h1> Register </h1>
        <form onSubmit={this.handleSubmit}>

          <label>User Name</label>
          <input type="text" data-test="username" value={this.state.username} onChange={this.handleUserChange} />

          <label>Password</label>
          <input type="password" data-test="password" value={this.state.password} onChange={this.handlePassChange} />
		  
		  <label>Email</label>
          <input type="email" data-test="email" value={this.state.email} onChange={this.handleEmailChange} />
		  
		  <label>Firstname</label>
          <input type="text" data-test="text" value={this.state.fname} onChange={this.handlefnameChange} />
		  
		  <label>Lastname</label>
          <input type="text" data-test="text" value={this.state.lname} onChange={this.handlelnameChange} />
		  
          <input type="submit" value="Register" data-test="submit" />
        </form>
      </div>
	  
	  
    );
  }
}

export default Register;