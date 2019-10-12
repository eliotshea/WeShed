import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Auth from './Auth';
import './App.css';

class Profile extends Component {
	
	constructor() {
		super();
		this.state = {
			username: null
		};
	}
	

	getToken(){
	  alert(Cookies.get('mytoken')); 
	}
	
	async getU(){
	  var x = await Auth.getUser();
	  alert(x); 
	}

  render() {

    return (
      <div className="Profile">
        <h1> Profile page </h1>
		<button onClick={this.getToken}>
			getToken
		</button>
		<button onClick={this.getU}>
			getUser
		</button>
      </div>
	  
    );
  }
}

export default Profile;