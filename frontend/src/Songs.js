import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import Cookies from 'js-cookie';
import DI from './config/domain_info';
import './App.css';
import { View, StatusBar, TextInput, Text } from 'react-native';


//Referenced https://facebook.github.io/react-native/docs/getting-started
class SearchLabel extends Component{

	state = {
		isFocused: false,
	};
	handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

	render() {
    const { label, ...props } = this.props;
    const { isFocused } = this.state;
    const labelStyle = {
      position: 'absolute',
      left: 12,
      top: !isFocused ? 18 : 0,
      fontSize: !isFocused ? 20 : 14,
      color: !isFocused ? '#aaa' : '#000',
    };
    return (
      <View style={{ paddingTop: 18 }}>
        <Text style={labelStyle}>
          {label}
        </Text>
        <TextInput
          {...props}
          style={{	height: 25,
										width: 200,
										fontSize: 20,
										color: '#000',
										borderBottomWidth: 'medium',
										borderBottomColor: '#555'
					}}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
        />
      </View>
    );
  }
}

const PREFIX_DIR = './res/sheet_imgs/'

//Referenced https://www.robinwieruch.de/react-fetching-data
class songList extends Component {
	constructor(props) {
		super(props);
		//var song = { msid: null, Name: null, F_handle: null, Bt_ref: null};
		this.state = {
			song_arr: [],
			currentSong: ''
		};
		this.changeSong = this.changeSong.bind(this);
		this.resetState = this.resetState.bind(this);
	}

	componentDidMount(){
		fetch(DI.DOMAIN + '/get_songs')
		.then(response => response.json())
		.then(data => this.setState({ song_arr: data }));
	}

	changeSong(newSong, newTrack) {
		this.setState({
			currentSong: newSong,
			backingTrack: newTrack,
			timeStamp: Date.now()
	})
	}

	resetState() {
		let timeElapsed = (Date.now() - this.state.timeStamp) / 1000;
		alert(`You spent ${timeElapsed} seconds playing ${this.state.currentSong}`);
		this.setState({
			currentSong: '',
			backingTrack: '',
			timeStamp: 0
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
	let leadSheet = <p></p>;
	if(this.state.currentSong){
		leadSheet = <img src={require(`${PREFIX_DIR}${this.state.currentSong}`)} />
	}
	let songList = (<ul>
		{song_arr.map(song =>
			<li key={song.Msid} onClick={() => this.changeSong(song.F_handle, song.Bt_ref)}>
				<b>{song.Msid}</b> <b>{song.Name}</b> <b>{song.F_handle}</b> <b>{song.Bt_ref}</b>
			</li>
		)}
	</ul>);
	if(this.state.currentSong && this.state.backingTrack) {
		songList = <button onClick={this.resetState}>Choose another song</button>
	}


    return (
      <div className="Songs">
        <h1> Songs page </h1>
				<SearchLabel
          label="Search for song:"
					//value=
					//onSubmitEditing=
        />
		<div>
		{leadSheet}
		{player}
		</div>
		{songList}
      	</div>

    );
  }
}

export default songList;
