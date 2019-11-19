import React, { Component } from 'react';
import DI from './config/domain_info';
import Auth from './Auth';
import Wave from './Wave';

export default class Stats extends Component {
	constructor(props) {
		super(props);
		this.state = {
			streak_arr: []
		};
	}
	
	async componentDidMount(){
		
		var temp_username = await Auth.getUser();
		var d = {username: temp_username};
		
		fetch(DI.DOMAIN + "/get_streaks", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(d)
        }).then(response => response.json())
		.then(data => this.setState({ streak_arr: data }));
		
	}

render() {
	let streakList = (
	<ul>
		{this.state.streak_arr.map(streak =>
			<li key={streak.Psid}>
				<b>Psid: {streak.Psid} Start date: {streak.Psmin} End date: {streak.Psmax} Length: {streak.length}</b>
			</li>
		)}
	</ul>);
	
	
    return (
      <div className="Stats">
	  <h1>Statistics</h1>
	  
	  <Wave/>
	  <h3>Top Streaks</h3>
	  {streakList}
	  
      </div>
    );
  }
}