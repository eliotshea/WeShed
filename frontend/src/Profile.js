import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Auth from './Auth';
import './App.css';
import './profile.css'
import UserProfile from 'react-user-profile';
import firebase from 'firebase/app';
import 'firebase/storage';


class Profile extends Component {

	constructor() {
		super();
		this.state = {
			username: null,
			image: null,
			url: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleUpload = this.handleUpload.bind(this);
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
		const userName = 'First Last'
		const location = 'USA'

		const comments = [
			{
				id: '0',
				photo: '',
				userName: '',
				content: '',
				createdAt: 0
			}
		]
    return (
      <div className="Profile">
				<div style={{ margin: '0 auto', width: '100%' }}>
	        <UserProfile photo={this.state.url} userName={userName} location={location} initialLikesCount={0} initialFollowingCount={0} initialFollowersCount={0} initialComments={comments} />
					<div className="changepic">
					<h1> Change profile picture </h1>
					</div>
					<progress value={this.state.progress} max="100"/>
					<input type="file" onChange={this.handleChange}/>
					<button onClick={this.handleUpload}>Upload</button>
	      </div>
		<button onClick={this.getToken}>
			getToken
		</button>
		<button onClick={this.getU}>
			getUser
		</button>
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
