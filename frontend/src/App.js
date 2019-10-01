
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import './App.css';


class App extends Component {
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
			alert(response.token);
			localStorage.setItem('acess_token', response.token);
			alert(localStorage['acess_token']);
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
  
  check4loggedin() {
    alert("checking for logged in");
	alert(localStorage['acess_token'])
	fetch('http://localhost:4000/verify', {
		method: 'GET',
		headers: {
		'Authorization': 'Bearer ' + localStorage['acess_token']
			}	
	})
	.then(res => res.json())
	.then(data => { alert(data.message) })
	.catch(err => { console.log(err) })
		
		
  }

  render() {

	
	if (this.state.toHome === true) {
	  alert("triggered redirect to home");
      return <Redirect to='/Home' />
    }

    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>

          <label>User Name</label>
          <input type="text" data-test="username" value={this.state.username} onChange={this.handleUserChange} />

          <label>Password</label>
          <input type="password" data-test="password" value={this.state.password} onChange={this.handlePassChange} />

          <input type="submit" value="Log In" data-test="submit" />
        </form>
		<div>
		<button onClick={this.check4loggedin}>
			check4loggedin
		</button>
		</div>
      </div>
	  
	  
    );
  }
}

export default App;
