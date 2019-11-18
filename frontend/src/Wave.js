import React, { Component } from "react";
import Sketch from "react-p5";

//Referenced https://stackoverflow.com/questions/54868777/how-to-use-react-with-p5-js
export default class Wave extends Component {
	
  CANVASX = 1920;
  CANVASY = 400;
  AMPLITUDE = 150;
  i = 0;
  tick = 0;
	
  setup = (p5, parent) => {
    p5.createCanvas(this.CANVASX, this.CANVASY).parent(parent)
	

  }
  draw = p5 => {
	p5.noFill();
	
	p5.clear();
	p5.stroke(0,0,255*Math.sin(this.tick), 50);
	p5.strokeWeight(5);
	p5.line(0,(this.CANVASY/2),this.CANVASX,(this.CANVASY/2));
	
	for(let k = 0; k < this.CANVASX; k++){
		p5.strokeWeight(4*Math.sin(this.tick));
		p5.stroke(0,0,255*Math.sin(this.tick));
		p5.point(k, (this.AMPLITUDE*Math.sin(2*(this.tick))) + (this.CANVASY/2))
		this.tick+=1
	}
  }

  render() {
    return <Sketch setup={this.setup} draw={this.draw} />
  }
}