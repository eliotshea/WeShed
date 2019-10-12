import React, { Component } from 'react';
import Cookies from 'js-cookie';
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

class Songs extends Component {
  
	getToken(){
	  alert(Cookies.get('mytoken')); 
	}
  


render() {

    return (
      <div className="Songs">
        <h1> Songs page </h1>
		
		
		<div>
		<img src={ require('./res/sheet_imgs/stablemates.png') } />
		</div>
		
		
		<button onClick={this.getToken}>
			getToken
		</button>
      </div>
	  
    );
  }
}

export default Songs;