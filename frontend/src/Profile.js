import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Auth from './Auth';
import './App.css';
import UserProfile from 'react-user-profile';
import axios from 'axios';
import DI from './config/domain_info';

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
		const fd = new FormData();
		fd.append('image', this.state.image, this.state.image.name);
		const uploadTask = axios.post(DI.DOMAIN);
	}

  render() {
		const photo = this.state.image
		const userName = 'Harvey Specter'
		const location = 'New York, USA'

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
	        <UserProfile photo={photo} userName={userName} location={location} initialLikesCount={0} initialFollowingCount={0} initialFollowersCount={0} initialComments={comments} />
					<h1> Change profile picture </h1>
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

export default Profile;
