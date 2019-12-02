import React, { Component } from 'react';
import DI from './config/domain_info';
import { Link } from 'react-router-dom';
import './App.css';
import Auth from './Auth';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      history_arr: []
    }
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
        {recommendations}
        {history}
      </div>
	  
    );
  }
}

export default Home;