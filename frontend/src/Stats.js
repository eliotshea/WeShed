import React, { Component } from 'react';
import DI from './config/domain_info';
import Auth from './Auth';
import Wave from './Wave';

export default class Stats extends Component {


render() {
    return (
      <div className="Stats">
	  <h1>Statistics</h1>
	  
	  <Wave/>
	  
      </div>
    );
  }
}