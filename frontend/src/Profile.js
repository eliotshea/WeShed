import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Auth from './Auth';
import './App.css';

class Profile extends Component {

	getToken(){
	  alert(Cookies.get('access_token')); 
	}

  render() {

    return (
      <div className="Profile">
        <h1> Profile page </h1>
		<button onClick={this.getToken}>
			getToken
		</button>
      </div>
	  
    );
  }
}

export default Profile;