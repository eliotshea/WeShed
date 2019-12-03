import React, { Component } from 'react';
import DI from './config/domain_info';
import { Link } from 'react-router-dom';
import './App.css';
import Auth from './Auth';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      history_arr: [],
	  username2: '',
	  userchallenge: '',
	  message: ''
    }
	
	this.addFriend = this.addFriend.bind(this);
	this.addChallenge = this.addChallenge.bind(this);
	this.handleUserChange = this.handleUserChange.bind(this);
	this.handleUserChallengeChange = this.handleUserChallengeChange.bind(this);
	this.handleMsgChange = this.handleMsgChange.bind(this);
  }

  async componentDidMount(){
    var obj;
    var username = await Auth.getUser();
    var d = {
      username: username
    };
    fetch(DI.DOMAIN + "/get_history", {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(d)
		}).then(response => response.json())
		.then(data => obj = data)
		.then(() =>{
      this.setState({history_arr: obj,
        leastfavorite: obj.slice(-1)[0].Name,
        favorite: obj[0].Name
      });
      
    });
    
  }
  
  async addFriend(evt) {
		evt.preventDefault();
		
		//To ensure that empty is never used for insertions to friends
		if(this.state.username2 !== ''){
			var temp_username = await Auth.getUser();

			var data = {
				username: temp_username,
				username2: this.state.username2
			}
		
			fetch(DI.DOMAIN + "/add_friend", {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(data)
			}).then(function(response) {
				if (response.status >= 400) {
					throw new Error("Bad response from server");
				}
			}).catch(function(err) {
				console.log(err)
				});
		}
  }
  
  async addChallenge(evt) {
		evt.preventDefault();
		if(this.state.userchallenge !== ''){
			var temp_username = await Auth.getUser();

			var data = {
				username: temp_username,
				userchallenge: this.state.userchallenge,
				message: this.state.message
			}
		
			fetch(DI.DOMAIN + "/add_challenge", {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(data)
			}).then(function(response) {
				if (response.status >= 400) {
					throw new Error("Bad response from server");
				}
			}).catch(function(err) {
				console.log(err)
				});
		}
  }
  
  handleUserChange(evt) {
    this.setState({
      username2: evt.target.value,
    });
  }
  
  handleUserChallengeChange(evt) {
    this.setState({
      userchallenge: evt.target.value,
    });
  }
  
  handleMsgChange(evt) {
    this.setState({
      message: evt.target.value,
    });
  }

        

  render() {

    let history = (
      <table className="History">
        <tr>
          <th>Title</th>
          <th>Last played</th>
          <th>Total time</th>
        </tr>
        {this.state.history_arr.map(item =>
          <tr>
            <td>{item.Name}</td>
            <td>{item.Max_date.substring(0,10)}</td>
            <td>{item.total}</td>
            <td>{<Link to={{
                  pathname: 'Songs',
                  state: {
                    Msid: item.Msid,
                    Name: item.Name,
                    F_handle: item.F_handle,
                    Bt_ref: item.Bt_ref
                  }
                }}>Play</Link>}</td>
          </tr>
        )}
      </table>
      );

    let recommendations = <div>
      <h6>I would recommend playing {this.state.leastfavorite}, your least played song</h6>
      <h6>Or relax with your favorite, {this.state.favorite}</h6>
    </div>
    
    return (
      <div className="Home">
	  <h1>Home</h1>
        {recommendations}
        {history}
		
		
		<div>
		<form onSubmit={this.addFriend}>
          <label>Username</label>
          <input type="text" data-test="username2" value={this.state.username2} onChange={this.handleUserChange} />

          <input type="submit" value="Add friend" data-test="submit" />
        </form>
		</div>
		
		<div>
		<br></br>
		<form onSubmit={this.addChallenge}>
		  <h6><b>Challenge a User</b></h6>
          <label>To:</label>
          <input type="text" value={this.state.userchallenge} onChange={this.handleUserChallengeChange} />
		  <label>Message:</label>
		  <input type="text" data-test="message" value={this.state.message} onChange={this.handleMsgChange} />
          <input type="submit" value="Add challenge" data-test="submit" />
        </form>
		</div>
		
      </div>
	  
    );
  }
}

export default Home;