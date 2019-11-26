import React, { Component } from 'react';
import DI from './config/domain_info';
import Auth from './Auth';
import Levelbadge from './Levelbadge';
import Donutchart from './Donutchart';

export default class Stats extends Component {
	constructor(props) {
		super(props);
		this.state = {
			streak_arr: [],
			gfav_song: 'N/A',
			gfav_song_count: 0,
			fav_song: 'N/A',
			fav_song_count: 0,
			wor_song: 'N/A',
			wor_song_count: 0
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
		
		fetch(DI.DOMAIN + '/get_gfav_song')
		.then(response => response.json())
		.then(data => {
			if(data.length > 0)
				this.setState({ gfav_song: data[0].Name, gfav_song_count: data[0].Max_count });
		});
		
		fetch(DI.DOMAIN + '/get_gwor_song')
		.then(response => response.json())
		.then(data => {
			if(data.length > 0)
				this.setState({ gwor_song: data[0].Name, gwor_song_count: data[0].Min_count });
		});
		
		fetch(DI.DOMAIN + "/get_fav_song", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(d)
        }).then(response => response.json())
		.then(data => {
			if(data.length > 0)
				this.setState({ fav_song: data[0].Name, fav_song_count: data[0].Max_count });
		});
		
		fetch(DI.DOMAIN + "/get_wor_song", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(d)
        }).then(response => response.json())
		.then(data => {
			if(data.length > 0)
				this.setState({ wor_song: data[0].Name, wor_song_count: data[0].Min_count });
		});
		
	}

render() {
	let streakList = (
	<ul>
		{this.state.streak_arr.map(streak =>
			<li key={streak.Psmin}>
				<b>Start date: {streak.Psmin} End date: {streak.Psmax} Length: {streak.length}</b>
			</li>
		)}
	</ul>);
	
let favSong = <h6><b>Global Favorite Song:</b> {this.state.gfav_song} played {this.state.gfav_song_count} times <b>Favorite Song:</b> {this.state.fav_song} played {this.state.fav_song_count} times</h6>
let worSong = <h6><b>Global Least Played Song:</b> {this.state.gwor_song} played {this.state.gwor_song_count} times <b>Least Played Song:</b> {this.state.wor_song} played {this.state.wor_song_count} times</h6>
	
    return (
      <div className="Stats">
	  <h1>Statistics</h1>
	  <Levelbadge/>
	  <Donutchart/>
	  {favSong}
	  {worSong}
	  <h3>Top Streaks</h3>
	  {streakList}
	  
      </div>
    );
  }
}