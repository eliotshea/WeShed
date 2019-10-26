import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

class Header extends Component {

  render() {

    return (
      <div className="Header">
        <Link to='Register'>Register</Link><br/>
        <Link to='Login'>Login</Link><br/>
        <Link to='Home'>Home</Link><br/>
		<Link to='Playlists'>Playlists</Link><br/>
        <Link to='Songs'>Songs</Link><br/>
        <Link to='Profile'>Profile</Link><br/>
      </div>
    );
  }
}

export default Header;
