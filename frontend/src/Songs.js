import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import DI from './config/domain_info';
import Cookies from 'js-cookie';
import Auth from './Auth';
import './App.css';
import {isEmpty} from 'lodash';

const PREFIX_DIR = './res/sheet_imgs/'

function getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return year + '-' + month + '-' + day;
 }

//Referenced https://www.robinwieruch.de/react-fetching-data
class songList extends Component {
	constructor(props) {
		super(props);
		this.state = {
      songName: '',
			song_arr: [],
			Pname: '',
		};
		this.changeSong = this.changeSong.bind(this);
		this.newSong = this.newSong.bind(this);
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

		//To ensure that empty is never used for insertions to playlist songs
		if(this.state.Pname !== ''){
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

	}

	componentDidMount(){
		fetch(DI.DOMAIN + '/get_songs')
		.then(response => response.json())
		.then(data => this.setState({ song_arr: data }));

		//Recieves props passed from the search bar
		if(!isEmpty(this.props.location.state)){
			const { Msid } = this.props.location.state;
			const { Name } = this.props.location.state;
			const { F_handle } = this.props.location.state;
			const { Bt_ref } = this.props.location.state;

			this.setState({
				curr_Msid: Msid,
				curr_Name: Name,
				curr_F_handle: F_handle,
				curr_Bt_ref: Bt_ref,
				timeStamp: Date.now()
			})
	}
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

	 async newSong(evt) {
		 evt.preventDefault();

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

		if (this.state.Streak_checked === false){
			fetch(DI.DOMAIN + "/get_user_play_sessions", {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(data)
			}).then(response => {
				console.log(response);
				response.json();
			}).then(data => {
				this.setState({dateArray: data})
			})
				for (var i in this.state.dateArray) {
					console.log(i);
				}
			};



		this.setState({
			curr_Msid: '',
			curr_Name: '',
			curr_F_handle: '',
			curr_Bt_ref: '',
			timeStamp: 0
		})
	}


	get_current_song(){
	  alert('info: ' + this.state.curr_Msid)
	}

//search
  handleOnInputChange = (event) => {
  	const songName = event.target.value;
              this.setState({ songName } );
  };


render() {
	//Logic deciding whether a lead sheet is displayed or not
	//Place for general display logic
	const {songName, song_arr} = this.state;
	let player = <p></p>;
	if(this.state.curr_Bt_ref){
		player = <center><ReactPlayer url={this.state.curr_Bt_ref} controls="true" /> </center>
	}
	let leadSheet = <p></p>;
	if(this.state.curr_F_handle){
		leadSheet = <center><img className="sheet" src={require(`${PREFIX_DIR}${this.state.curr_F_handle}`)}/></center>
	}

  let songList = (<ul>
   {song_arr.map((song) =>{
     if(song.Name.toLowerCase().substr(0,songName.length) == songName.toLowerCase()){
      return(<li className="songList" key={song.Msid} onClick={() => this.changeSong(song)}>
        <button className="songButtons">
          <img
            style={{width: 200, height: 200}}
            src={require(`${PREFIX_DIR}${song.F_handle}`)}
          />
          <p>{song.Name}</p>
        </button>
     </li>)}
   })}
  </ul>);
  if(this.state.curr_F_handle && this.state.curr_Bt_ref) {
    songList = <button onClick={this.newSong}>Choose another song</button>
  }


    return (

      <div className="background">
      <div className="Songs">

      <div className="pageTitle">
        <h1> Songs </h1>

    		  <form onSubmit={this.handleSubmit}>
    		    <label>Playlist Name</label>
              <input className="inputBar" type="text" data-test="text" value={this.state.Pname} onChange={this.handlePnameChange} />
    		      <input className="buttons" type="submit" value="Add to playlist" data-test="submit" />
    		  </form>
          &nbsp;
          <form ref="form">
            <input id="input"
              type="text"
              placeholder="Search for song..."
              onChange={this.handleOnInputChange}
              className="inputBar"
            />
        </form>
      </div>

  		<div className="sheet">
    		{leadSheet}
      </div>

      <div className="player">
    		{player}
  		</div>

      <div className="songDisplay">
		  {songList}
      </div>

      </div>
      </div>
    );
  }
}

export default songList;
