import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Auth from './Auth';
import './App.css';
import './profile.css'
import { Grid, Cell } from 'react-mdl'
import firebase from 'firebase/app';
import 'firebase/storage';
import DI from './config/domain_info';


class Profile extends Component {

	constructor() {
		super();
		this.state = {
			fullName: null,
			userName: 'coolguy99',
			image: null,
			url: 'https://icon-library.net/images/default-profile-icon/default-profile-icon-24.jpg',
			fullName: 'John Doe',
			location: 'USA',
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleUpload = this.handleUpload.bind(this);
	}

	changeName(e){
		this.setState({
		 fullName: e.target.value
	 });
	}

	async componentDidMount(){
		var usertemp = await Auth.getUser()
		this.setState({
		 userName: usertemp,
	 })
	 var fnametemp = await Auth.getFname()
	 this.setState({
		 fullName: fnametemp,
	 });
	}

	changeLocation(e){
		this.setState({
		 location: e.target.value
	 });
	}

	getToken(){
	  alert(Cookies.get('mytoken'));
	}

	async getU(){
	  var x = await Auth.getUser();
	  alert(x);
	}

	handleChange = e => {
		if(e.target.files[0]){
			const image = e.target.files[0];
			this.setState(() => ({image}));
		}
	}

	handleUpload = () => {
		const {image} = this.state;
		const uploadTask = storage.ref(`images/${image.name}`).put(image);
		uploadTask.on('state_changed',
		(snapshot) => {
			const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
			this.setState({progress});
		},
		(error) => {
			console.log(error);
		},
		() => {
			storage.ref('images').child(image.name).getDownloadURL().then(url => {
				console.log(url);
				this.setState({url});
			})
	});
	}

  render() {

  return (
			<div className="background">
      <div className="Profile">
			<div style={{width: '100%', margin: 'auto'}}>
			<Grid className="ProfLay">
			<Cell col={12}>
			<img src={this.state.url}
			alt="Profile Picture"
			className="avatar-img"/>
			<div className="banner">
			<h3>@{this.state.userName}</h3>
			<h2>{this.state.location}</h2>
			</div>
			</Cell>
			</Grid>
			</div>
					<div className="changepic">
					<h1 className="changepic">Edit Profile</h1>
					</div>
					<input type="file" onChange={this.handleChange}/>
					<button onClick={this.handleUpload}>Upload</button>
					<div/>
		<input
type="text"
value={this.state.location}
onChange={e => this.changeLocation(e)}
/>
<div/>

		<button onClick={this.getToken}>
			getToken
		</button>
		<button onClick={this.getU}>
			getUser
		</button>
		</div>
      </div>

    );
  }
}

const firebaseConfig = {
  apiKey: "AIzaSyBFjweaEnOTTmXDSnDyNjcGjMDJj99hFv0",
  authDomain: "weshed-6f6e8.firebaseapp.com",
  databaseURL: "https://weshed-6f6e8.firebaseio.com",
  projectId: "weshed-6f6e8",
  storageBucket: "weshed-6f6e8.appspot.com",
  messagingSenderId: "535001581704",
  appId: "1:535001581704:web:ecd7888639f1dadcf7b73d",
  measurementId: "G-WTSSQPS5GV"
};

  firebase.initializeApp(firebaseConfig);

	const storage = firebase.storage();

	export{
		storage, firebase, Profile as default
	}
