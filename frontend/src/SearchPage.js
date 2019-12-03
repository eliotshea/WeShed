import React, { Component } from 'react';
import DI from './config/domain_info';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import Auth from './Auth';


//Referenced:
//https://medium.com/@imranhsayed/live-search-with-react-instant-search-pagination-6acd476af756
//https://medium.com/@willhowardgb/building-a-beautiful-text-input-component-in-react-f85564cc7e86

const PREFIX_DIR = './res/sheet_imgs/'

export default class SearchPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      songName: '',
      song_arr: [],
      curr_Msid: '',
      curr_Name: '',
      curr_F_handle: '',
      curr_Bt_ref: '',
      active: (props.locked && props.active) || false,
    };
    this.newSong = this.newSong.bind(this);
  }

  componentDidMount(){
    fetch(DI.DOMAIN + '/get_songs')
    .then(response => response.json())
    .then(data => this.setState({ song_arr: data }));
  }

  changeSong(song) {
    this.setState({
      songName: '',
      curr_Msid: song.Msid,
      curr_Name: song.Name,
      curr_F_handle: song.F_handle,
      curr_Bt_ref: song.Bt_ref,
    })
  }

  handleOnInputChange = (event) => {
  	const songName = event.target.value;
              this.setState({ songName } );
  };

  async newSong(evt) {
    this.setState({
      songName: '',
			curr_Msid: '',
			curr_Name: '',
			curr_F_handle: '',
			curr_Bt_ref: '',
		})
    this.refs.form.reset();
  }

  render() {
    const { songName, song_arr, list_size, active } = this.state;
    const { locked } = this.props;
    const fieldClassName = `field ${(locked ? active : active || this.state.curr_name) && 'active'} ${locked && !active && 'locked'}`;

    let player = <p></p>;
    if(this.state.curr_Bt_ref){
      player = <center>
                  <ReactPlayer  className="player"
                    url={this.state.curr_Bt_ref} controls="true"
                    />
                </center>
    }

    let leadSheet = <p></p>;
    if(this.state.curr_F_handle){
      leadSheet = <center>
                    <img  className="sheet"
                      src={require(`${PREFIX_DIR}${this.state.curr_F_handle}`)}
                      width='25%'
                    />
                  </center>
    }

    let matches = 0;
    let songList = (<ul>
     {song_arr.map((song) =>{
       if(song.Name.toLowerCase().substr(0,songName.length) == songName.toLowerCase()){
        matches++;
        return(<li className="songs" key={song.Msid} onClick={() => this.changeSong(song)}>
          <button className="button">
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
      <div className="searchPage">
        <div className={fieldClassName}>

          <form ref="form">
            <input id="input"
            type="text"
            placeholder="Search for song..."
            onChange={this.handleOnInputChange}
            onFocus={() => !locked && this.setState({ active : true })}
            onBlur={() => !locked && this.setState({ active: false })}
            />
          </form>
        </div>

        <div>
          <h6 className="message">
            {matches} {(matches == 1 ? "result" : "results")} found for '{songName}'
          </h6>

          <div className="songList">
            {songList}
          </div>
        </div>

        <div className="songPage">
          {leadSheet}
          {player}
        </div>

      </div>
    );
  }
}
