import React, { Component } from 'react';
import Cookies from 'js-cookie';
import './App.css';

class Home extends Component {

	getToken(){
	  alert(Cookies.get('mytoken'));
	}

  render() {


    return (
      <div className="Home">
        <h1> home page </h1>
		<button onClick={this.getToken}>
			getToken
		</button>
      </div>
	  
    );
  }
}

export default Home;