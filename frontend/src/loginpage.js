import React, { Component } from 'react';
import logo from './weshedlogo.png';
import './loginpage.css';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { FacebookLoginButton } from 'react-social-login-buttons';

class loginpage extends Component {
  render(){
    return (
      <div className="App">
      <div className="background">
      <img src={logo} className="App-logo" alt="Logo" />
      <h1 className="welcome">
      Welcome to WeShed
      </h1>
      <Form className="login-form">
        <FormGroup>
          <Label>Email</Label>
          <Input type="email" placeholder="Email"/>
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input type="password" placeholder="Password"/>
        </FormGroup>
        <Button className="btn-lg btn-dark btn-block">Log in</Button>
        <div className="text-center pt-3">Or log in with other social media
        </div>
        <FacebookLoginButton classname="mt-3 mb-3"/>
        <div className="text-ceenter"/>
          <a href="/sign-up" className="link">Sign up</a>
          <span className="p-2">|</span>
          <a href="/sign-up" className="link">Forgot Password</a>
      </Form>
      </div>
      </div>

    )
  }
}

export default loginpage;
