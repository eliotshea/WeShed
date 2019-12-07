import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import DI from './config/domain_info';
import Auth from './Auth';
import './App.css';

const PREFIX_DIR = './res/sheet_imgs/'

function getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return year + '-' + month + '-' + day;
 }

//Referenced https://www.robinwieruch.de/react-fetching-data and Songs.js
class Playlist extends Component {
	constructor(props) {
		super(props);
		this.state = {
			song_arr: [],
			curr_Msid: '',
			curr_Name: '',
			curr_F_handle: '',
			curr_Bt_ref: '',
			curr_Siid: '',
			curr_Pname: ''
		};
		this.changeSong = this.changeSong.bind(this);
		this.resetState = this.resetState.bind(this);
		this.delSong = this.delSong.bind(this);
		this.delPlaylist = this.delPlaylist.bind(this);
	}

	delSong(evt) {
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

	async delPlaylist(evt) {
		evt.preventDefault();

		var temp_username = await Auth.getUser();

        var data = { username: temp_username,
					pname: this.state.curr_Pname}

        fetch(DI.DOMAIN + "/del_playlist", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(function(response) {
            if (response.status >= 400) {
              throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(response) {
			//Response from the successful deletions
			if(response.success)
				alert("Successful deletions");
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
		var d = {username: temp_username};

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
			curr_Pname: song.Pname,
			timeStamp: Date.now()
		})
	}

	async resetState() {

		//Converting JS date info to format SQL likes
		let timeElapsed = (Date.now() - this.state.timeStamp) / 1000;
		let currentDate = getFormattedDate(new Date(Date.now()));

		var tempMsid = parseInt(this.state.curr_Msid);
		var temp_username = await Auth.getUser();
		var data = {
			Msid: tempMsid,
			Username: temp_username,
			Time_played: new Date(timeElapsed * 1000).toISOString().substr(11, 8),
			currentDate: currentDate
		}
		fetch(DI.DOMAIN + "/create_play_session", {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(data)
		});


		this.setState({
			curr_Msid: '',
			curr_Name: '',
			curr_F_handle: '',
			curr_Bt_ref: '',
			curr_Siid: '',
			curr_Pname: '',
			timeStamp: 0
		})

		var d = {username: temp_username}

		fetch(DI.DOMAIN + "/get_playlists_songs", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(d)
        }).then(response => response.json())
		.then(info => this.setState({ song_arr: info }));
	}




render() {

	const {song_arr} = this.state;
	let player = null;
	if(this.state.curr_Bt_ref){
		player = <center><ReactPlayer url={this.state.curr_Bt_ref} controls="true" /> </center>
	}
	let leadSheet = null;
	if(this.state.curr_F_handle){
		leadSheet = <center><img className="sheet" src={require(`${PREFIX_DIR}${this.state.curr_F_handle}`)} /></center>
	}
	let Del_song = null;
	let Del_playlist = null;

	var prev_pname = '';
	//The purpose of this function is to only print Playlist name once based on trailing pname
	function Printsolopname(props){
		if(prev_pname !== props.tsong.Pname){
			prev_pname = props.tsong.Pname;
			return(<div align="left"><b> {props.tsong.Pname} </b></div>);
		}
		else{
			prev_pname = props.tsong.Pname;
			return(null);
		}
	}

	let Playlist = ( <ul>
		{song_arr.map(song =>
			<li key={song.Siid} onClick={() => this.changeSong(song)}>
		          <Printsolopname tsong = {song} />


				  <button className="songButtons">
					<img
					style={{width: 200, height: 200}}
					src={require(`${PREFIX_DIR}${song.F_handle}`)}
					/>
					<p>{song.Name}</p>
				  </button>
			</li>
		)}
	</ul> );



	if(this.state.curr_F_handle && this.state.curr_Bt_ref) {
		Playlist = <button className="buttons" onClick={this.resetState}>Choose another song</button>
		Del_song = <button className="buttons" onClick={this.delSong}>Delete current song</button>
		Del_playlist = <button className="buttons" onClick={this.delPlaylist}>Delete current playlist</button>
	}


    return (
      <div className="background">
      <div className="Playlists">

        <h2> Your Playlists </h2>

		<div className="sheet">
		{leadSheet}
    </div>

    <div className="player">
		{player}
		</div>

    <div>
    <div>
    <br></br>
    {Del_song}
    </div>

    <div>
    <br></br>
    {Del_playlist}
    </div>

    <div>
    <br></br>
    {Playlist}
    </div>
    </div>

		<div>
		<h4>  <b>Playlist:</b> {this.state.curr_Pname} <br></br> <b>Current:</b> {this.state.curr_Name} </h4>
		</div>

      </div>
      </div>


    );
  }
}

export default Playlist;
