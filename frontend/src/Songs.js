import React, { Component } from 'react';
import Cookies from 'js-cookie';
import DI from './config/domain_info';
import './App.css';


//const dir = '../resources/sheets/';
/*
const fs = require('fs');
const songList = ['All The Things You Are', 'Beautiful Love'];

fs.readdir(dir, (err, files) => {
  files.forEach(file => {
    songList.push(file);
  });
});


const ListItem = ({ value }) => (
  <li>{value}</li>
);

const List = ({ items }) => (
  <ul>
    {
      items.map((item, i) => <ListItem key={i} value={item} />)
    }
  </ul>
);
*/

const PREFIX_DIR = './res/sheet_imgs/'


//Referenced https://www.robinwieruch.de/react-fetching-data
class Songs extends Component {
	constructor(props) {
		super(props);
		
		var song = { msid: null, Name: null, F_handle: null, Bt_ref: null};
		
		this.state = { song_arr: [], };
	}
	
	
	componentDidMount(){
		
	fetch(DI.DOMAIN + '/get_songs')
      .then(response => response.json())
	  .then(data => this.setState({ song_arr: data }));	
	}
	
	
  
	getToken(){
	  alert(Cookies.get('mytoken'));
	}
  


render() {
	
	const { song_arr } = this.state;

    return (
      <div className="Songs">
        <h1> Songs page </h1>
		
		
		<div>
		<img src={ require(PREFIX_DIR + 'stablemates.png') } />
		</div>
		<ul>
			{song_arr.map(song_arr =>
			<li key={song_arr.Msid}>
				<b>{song_arr.Msid}</b> <b>{song_arr.Name}</b> <b>{song_arr.F_handle}</b> <b>{song_arr.Bt_ref}</b>
			</li>
			)}
		</ul>
		
		
		<button onClick={this.getToken}>
			getToken
		</button>
      </div>
	  
    );
  }
}

export default Songs;