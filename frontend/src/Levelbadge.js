import React, { Component } from "react";
import Sketch from "react-p5";
import DI from './config/domain_info';
import Auth from './Auth';

//Referenced https://stackoverflow.com/questions/54868777/how-to-use-react-with-p5-js
export default class Levelbadge extends Component {

	constructor(props) {
		super(props);
		this.state = {
			ps_count: 0
		};
	}
	
	async componentDidMount(){
		
		var temp_username = await Auth.getUser();
		var d = {username: temp_username};
		
		fetch(DI.DOMAIN + "/get_play_session_count", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(d)
        }).then(response => response.json())
		.then(data => {
			if(data.length > 0)
				this.setState({ ps_count: data[0].ps_count});
		});	
		
	}
	
	
  CANVASX = 200;
  CANVASY = 200;
	
  setup = (p5, parent) => {
    p5.createCanvas(this.CANVASX, this.CANVASY).parent(parent)
	

  }
  draw = p5 => {
	p5.noFill();
	
	p5.clear();
	
	p5.fill(45);

	p5.circle(this.CANVASX/2, this.CANVASY/2, this.CANVASX/2-10);
	p5.fill(155);
	p5.circle(this.CANVASX/2, this.CANVASY/2, this.CANVASX/2-30);
	
	p5.fill(0);
	p5.textSize(60);
	p5.text(String(Math.floor((this.state.ps_count/5)) + 1), this.CANVASX/2-15, this.CANVASY/2+15);
	
	
	
	this.iradians+=.01;
	
	
  }

  render() {
    return <div> <h3><b>Level</b></h3><Sketch setup={this.setup} draw={this.draw} /></div>
  }
}