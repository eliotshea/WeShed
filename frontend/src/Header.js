import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import SearchBar from './SearchBar'

class Header extends Component {

  render() {

    return (
      <div className="Header">
        <Link to='Register'>Register</Link><br/>
        <Link to='Login'>Login</Link><br/>
        <Link to='Home'>Home</Link><br/>
        <Link to='Songs'>Play</Link><br/>
        <Link to='Profile'>Profile</Link><br/>
        <SearchBar
          label="Search"
        />
      </div>
    );
  }
}

export default Header;
