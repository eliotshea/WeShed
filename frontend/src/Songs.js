import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import Cookies from 'js-cookie';
import DI from './config/domain_info';
import Auth from './Auth';
import './App.css';

const PREFIX_DIR = './res/sheet_imgs/'

//Referenced https://www.robinwieruch.de/react-fetching-data
class songList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			song_arr: [],
			Pname: '',
			curr_Msid: '',
			curr_Name: '',
			curr_F_handle: '',
			curr_Bt_ref: ''
		};
		this.changeSong = this.changeSong.bind(this);
		this.resetState = this.resetState.bind(this);
		this.handlePnameChange = this.handlePnameChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handlePnameChange(evt) {
    this.setState({
      Pname: evt.target.value
	   });
	};
	
	async handleSubmit(evt) {
		evt.preventDefault();
	
		var temp_username = await Auth.getUser();

        var data = {
            username: temp_username,
            pname: this.state.Pname,
			msid: this.state.curr_Msid
        }
		
        fetch(DI.DOMAIN + "/add_song_to_playlist", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(function(response) {
            if (response.status >= 400) {
              throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(response) {
			//Response from the successful register
			if(response.success)
				alert("Successful insertion");
			else
				alert("Something went wrong");
			
        }).catch(function(err) {
            console.log(err)
        });

	}

	componentDidMount(){
		fetch(DI.DOMAIN + '/get_songs')
		.then(response => response.json())
		.then(data => this.setState({ song_arr: data }));
	}

	changeSong(song) {
		this.setState({
			curr_Msid: song.Msid,
			curr_Name: song.Name,
			curr_F_handle: song.F_handle,
			curr_Bt_ref: song.Bt_ref,
			timeStamp: Date.now()
		})
	}

	resetState() {
		let timeElapsed = (Date.now() - this.state.timeStamp) / 1000;
		alert(`You spent ${timeElapsed} seconds playing ${this.state.curr_Name}`);
		this.setState({
			curr_Msid: '',
			curr_Name: '',
			curr_F_handle: '',
			curr_Bt_ref: '',
			timeStamp: 0
		})
	}

	getToken(){
	  alert(Cookies.get('mytoken'));
	}
	
	get_current_song(){
	  alert('info: ' + this.state.curr_Msid)
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
	let songList = (<ul>
		{song_arr.map(song =>
			<li key={song.Msid} onClick={() => this.changeSong(song)}>
				<b>{song.Msid}</b> <b>{song.Name}</b> <b>{song.F_handle}</b> <b>{song.Bt_ref}</b>
			</li>
		)}
	</ul>);
	if(this.state.curr_F_handle && this.state.curr_Bt_ref) {
		songList = <button onClick={this.resetState}>Choose another song</button>
	}


    return (
      <div className="Songs">
        <h1> Songs page </h1>
		
		<form onSubmit={this.handleSubmit}>
		<label>Playlist Name:</label>
        <input type="text" data-test="text" value={this.state.Pname} onChange={this.handlePnameChange} />
		<input type="submit" value="Add to playlist" data-test="submit" />
		</form>
		
		<div>
		{leadSheet}
		{player}
		</div>
		{songList}
		
		<div>
		<h4> <b>Current:</b> {this.state.curr_Msid} {this.state.curr_Name} {this.state.curr_F_handle} {this.state.curr_Bt_ref}</h4>
		</div>
		
      	</div>
		
		
    );
  }
}

export default songList;
