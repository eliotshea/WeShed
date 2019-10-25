import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import Cookies from 'js-cookie';
import DI from './config/domain_info';
import './App.css';

const PREFIX_DIR = './res/sheet_imgs/'

//Referenced https://www.robinwieruch.de/react-fetching-data
class songList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			song_arr: [],
			
			curr_Msid: null,
			curr_Name: null,
			curr_F_handle: null,
			curr_Bt_ref: null
		};
		this.changeSong = this.changeSong.bind(this);
		this.resetState = this.resetState.bind(this);
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
			curr_Msid: null,
			curr_Name: null,
			curr_F_handle: null,
			curr_Bt_ref: null,
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
