import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Switch, Route} from 'react-router-dom';

import Router from './Router';

class App extends React.Component {

  render() {
    return (
      <div className="App">
	  <Link to='Login'>Login</Link><br/>
	  <Link to='Home'>Home</Link><br/>
		<Router/>
		
      </div>
    );
  }
}

export default App;
