import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import DI from './config/domain_info';
import Auth from './Auth';
import './App.css';

const PREFIX_DIR = './res/sheet_imgs/'

//Referenced https://www.robinwieruch.de/react-fetching-data
class Playlist extends Component {
	constructor(props) {
		super(props);
		this.state = {
			song_arr: [],
			curr_Msid: '',
			curr_Name: '',
			curr_F_handle: '',
			curr_Bt_ref: '',
			curr_Siid: ''
		};
		this.changeSong = this.changeSong.bind(this);
		this.resetState = this.resetState.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleSubmit(evt) {
		evt.preventDefault();

        var data = { siid: this.state.curr_Siid }
		
        fetch(DI.DOMAIN + "/del_playlist_song", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(function(response) {
            if (response.status >= 400) {
              throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(response) {
			//Response from the successful deletion
			if(response.success)
				alert("Successful deletion");
			else
				alert("Something went wrong");
			
        }).catch(function(err) {
            console.log(err)
        });
		
		//Call a reset for song_arr refresh
		this.resetState();

	}

	async componentDidMount(){
		
		var temp_username = await Auth.getUser();
		
		var d = {username: temp_username}
		
		fetch(DI.DOMAIN + "/get_playlists_songs", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(d)
        }).then(response => response.json())
		.then(data => this.setState({ song_arr: data }));
		
	}

	changeSong(song) {
		this.setState({
			curr_Msid: song.Msid,
			curr_Name: song.Name,
			curr_F_handle: song.F_handle,
			curr_Bt_ref: song.Bt_ref,
			curr_Siid: song.Siid,
			timeStamp: Date.now()
		})
	}

	async resetState() {
		let timeElapsed = (Date.now() - this.state.timeStamp) / 1000;
		alert(`You spent ${timeElapsed} seconds playing ${this.state.curr_Name}`);
		this.setState({
			curr_Msid: '',
			curr_Name: '',
			curr_F_handle: '',
			curr_Bt_ref: '',
			curr_Siid: '',
			timeStamp: 0
		})
		
		//Update song_arr contents
		var temp_username = await Auth.getUser();
		
		var d = {username: temp_username}
		
		fetch(DI.DOMAIN + "/get_playlists_songs", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(d)
        }).then(response => response.json())
		.then(data => this.setState({ song_arr: data }));
	}



render() {

	const {song_arr} = this.state;
	let player = <p></p>;
	if(this.state.curr_Bt_ref){
		player = <center><ReactPlayer url={this.state.curr_Bt_ref} controls="true" /> </center>
	}
	let leadSheet = <p></p>;
	if(this.state.curr_F_handle){
		leadSheet = <center><img src={require(`${PREFIX_DIR}${this.state.curr_F_handle}`)} /></center>
	}
	let Playlist = (<ul>
		{song_arr.map(song =>
			<li key={song.Msid} onClick={() => this.changeSong(song)}>
				<b>Siid: {song.Siid}</b> <b>Msid: {song.Msid}</b> <b>{song.Name}</b> <b>{song.F_handle}</b> <b>{song.Bt_ref}</b> <b>Playlist name: {song.Pname}</b>
			</li>
		)}
	</ul>);
	if(this.state.curr_F_handle && this.state.curr_Bt_ref) {
		Playlist = <button onClick={this.resetState}>Choose another song</button>
	}


    return (
      <div className="Songs">
        <h1> Songs page </h1>
		
		<div>
		{leadSheet}
		{player}
		</div>
		{Playlist}
		
		<div>
		<h4> <b>Current:</b> Siid: {this.state.curr_Siid} Msid: {this.state.curr_Msid} {this.state.curr_Name} {this.state.curr_F_handle} {this.state.curr_Bt_ref}</h4>
		</div>
		
		<div>
		<form onSubmit={this.handleSubmit}>
		<input type="submit" value="Delete current song" data-test="submit" />
		</form>
		</div>
		
      	</div>
		
		
    );
  }
}

export default Playlist;