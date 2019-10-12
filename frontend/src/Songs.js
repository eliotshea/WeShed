import React, { Component } from 'react';
import Cookies from 'js-cookie';
import './App.css';

class Songs extends Component {

	getToken(){
	  alert(Cookies.get('mytoken')); 
  }
  

  render() {

    return (
      <div className="Songs">
        <h1> Songs page </h1>
		<button onClick={this.getToken}>
			getToken
		</button>
      </div>
	  
    );
  }
}

export default Songs;