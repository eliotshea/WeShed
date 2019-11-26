import React, { Component } from "react";
import Sketch from "react-p5";
import DI from './config/domain_info';
import Auth from './Auth';

//Referenced https://stackoverflow.com/questions/54868777/how-to-use-react-with-p5-js
export default class Donutchart extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			days_played: 0
		};
	}
	
	async componentDidMount(){
		
		var temp_username = await Auth.getUser();
		var d = {username: temp_username};
		
		await fetch(DI.DOMAIN + "/get_days_played", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(d)
        }).then(response => response.json())
		.then(data => {
			if(data.length > 0)
				this.setState({ days_played: data[0].days_played});
		});
		
		//this.setState({ days_played: 365});
		
	}
	
  CANVASX = 300;
  CANVASY = 300;
  XPOS = 0;
  YPOS = 0;
  
  iradians = 0;
	
  setup = (p5, parent) => {
    p5.createCanvas(this.CANVASX, this.CANVASY).parent(parent)
	

  }
  draw = p5 => {
	p5.strokeWeight(1);
	p5.clear();
	
	//Apply golden record coating or regular
	if(this.state.days_played < 365)
		p5.fill(45);
	else
		p5.fill(p5.color(212,175,55));

	p5.circle((this.XPOS+this.CANVASX)/2, (this.YPOS+this.CANVASY)/2, (this.CANVASX/2)-5, (this.CANVASY/2)-5);
	
	//Record grooves/lines
	p5.circle((this.XPOS+this.CANVASX)/2, (this.YPOS+this.CANVASY)/2, this.CANVASX/2.5,this.CANVASY/2.5);
	p5.circle((this.XPOS+this.CANVASX)/2, (this.YPOS+this.CANVASY)/2, this.CANVASX/3,this.CANVASY/3);
	p5.circle((this.XPOS+this.CANVASX)/2, (this.YPOS+this.CANVASY)/2, this.CANVASX/4,this.CANVASY/4);
	
	//Green progress line
	if(this.state.days_played < 365){
		p5.fill(p5.color(100,255,100));
		if(this.state.days_played !== 0)
			p5.arc((this.XPOS+this.CANVASX)/2, (this.YPOS+this.CANVASY)/2, this.CANVASX, this.CANVASY, this.iradians, this.iradians + ((p5.TWO_PI/365)*this.state.days_played));
	}
	else{
		//The white shimmer arc
		p5.fill(p5.color(255,255,255));
		p5.arc((this.XPOS+this.CANVASX)/2, (this.YPOS+this.CANVASY)/2, this.CANVASX, this.CANVASY, this.iradians, this.iradians + ((p5.TWO_PI/365)*10));
		
	}
	
	//Grey medium circle
	p5.fill(155);
	p5.circle((this.XPOS+this.CANVASX)/2, (this.YPOS+this.CANVASY)/2, this.CANVASX/5,this.CANVASY/5);
	
	//The white hole in the record
	p5.fill(255)
	p5.circle((this.XPOS+this.CANVASX)/2, (this.YPOS+this.CANVASY)/2, this.CANVASX/50,this.CANVASY/50);
	
	//The record needle
	p5.strokeWeight(10);
	p5.line(this.CANVASX+50, 0, this.CANVASX-80,250);
	p5.circle(this.CANVASX-80,250,4);
	
	this.iradians+=.01;
	
  }

  render() {
    return <div> <h4>{this.state.days_played} days played out of 365</h4> <Sketch setup={this.setup} draw={this.draw} /> </div>
  }
}