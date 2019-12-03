import React, { Component } from 'react';
import {isEmpty} from 'lodash';
import DI from './config/domain_info';
import Auth from './Auth';
import Levelbadge from './Levelbadge';
import Donutchart from './Donutchart';
import './App.css';

function getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return year + '-' + month + '-' + day;
 }

export default class Stats extends Component {
	constructor(props) {
		super(props);
		this.state = {
			streak_arr: [],
			history_arr: [],
			gfav_song: 'N/A',
			gfav_song_count: 0,
			fav_song: 'N/A',
			fav_song_count: 0,
			wor_song: 'N/A',
			wor_song_count: 0
		};
	}

	async componentDidMount(){
		var obj;
		var temp_username, d;
		if (isEmpty(this.props.location.state)){
			temp_username = await Auth.getUser();
			d = {username: temp_username};
		} else {
			const { Username } = this.props.location.state;
			temp_username = Username;
			d = {username: Username};
		}

		let today = getFormattedDate(new Date(Date.now()));

		fetch(DI.DOMAIN + "/get_streaks", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(d)
		}).then(response => response.json())
		.then(data => {
			this.setState({ username: temp_username, streak_arr: data, max_streak: data[0].length, current_streak: 0})
			data.forEach(streak =>{
				if( streak.Psmax.substring(0,10) === today ){
					this.setState({current_streak: streak.length})
				}
			})
		});

		fetch(DI.DOMAIN + "/get_history", {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(d)
		}).then(response => response.json())
		.then(data => obj = data)
		.then(() =>{
			this.setState({history_arr: obj});
		});

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
				<b>Start date: {streak.Psmin.substring(0,10)} End date: {streak.Psmax.substring(0,10)} Length: {streak.length}</b>
			</li>
		)}
	</ul>);

	let history = (
		<table className="History">
			<tr>
				<th>Title</th>
				<th>Last played</th>
				<th>Total time</th>
			</tr>
			{this.state.history_arr.map(item =>
				<tr>
					<td>{item.Name}</td>
					<td>{item.Max_date.substring(0,10)}</td>
					<td>{item.total}</td>
				</tr>
			)}
		</table>
		);

let favSong = <h6><b>Global Favorite Song:</b> {this.state.gfav_song} played {this.state.gfav_song_count} times <b>Favorite Song:</b> {this.state.fav_song} played {this.state.fav_song_count} times</h6>
let worSong = <h6><b>Global Least Played Song:</b> {this.state.gwor_song} played {this.state.gwor_song_count} times <b>Least Played Song:</b> {this.state.wor_song} played {this.state.wor_song_count} times</h6>

    return (
      <div className="Stats">
      <div className="background">

      <div className="topStreaks">
  		<h3>Top Streaks</h3>
  		{history}
  		{streakList}
      </div>

		<div className="headerCard">
			<h1>{this.state.username}</h1>
			<Levelbadge className="Levelbadge"/>
			<p>Longest streak: {this.state.max_streak}</p>
			<p>Current streak: {this.state.current_streak}</p>
		</div>
		<Donutchart className="Donutchart"/>

		{favSong}
		{worSong}

      </div>
      </div>
    );
  }
}
