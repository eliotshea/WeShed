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
		//var song = { msid: null, Name: null, F_handle: null, Bt_ref: null};
		this.state = {
			song_arr: [],
			currentSong: 'stablemates.png' 
		};
	}
	
	componentDidMount(){	
		fetch(DI.DOMAIN + '/get_songs')
		.then(response => response.json())
		.then(data => this.setState({ song_arr: data }));	
	}

	changeSong(newSong, newTrack) {
		this.setState({
			currentSong: newSong,
			backingTrack: newTrack
	})
	}
	
	getToken(){
	  alert(Cookies.get('mytoken'));
	}
  


render() {
	
	const {song_arr} = this.state;
	let player = <p></p>;
	if(this.state.backingTrack){
		player = <ReactPlayer url={this.state.backingTrack} controls="true" />
	}
    return (
      <div className="Songs">
        <h1> Songs page </h1>
		
		<div>
		<img src={require(`${PREFIX_DIR}${this.state.currentSong}`)} />
		{player}
		</div>
		<ul>
			{song_arr.map(song =>
				<li key={song.Msid} onClick={() => this.changeSong(song.F_handle, song.Bt_ref)}>
					<b>{song.Msid}</b> <b>{song.Name}</b> <b>{song.F_handle}</b> <b>{song.Bt_ref}</b>
				</li>
			)}
		</ul>
      	</div>
	  
    );
  }
}

export default songList;