import React from 'react';
import {Header} from './Header';
import Router from './Router';

class App extends React.Component {

  render() {
    return (
      <div className="App">
		<Header/>
		<Router/>

      </div>
    );
  }
}

export default App;
