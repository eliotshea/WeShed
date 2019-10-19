import React, { Component } from 'react';
import logo from './weshedlogo.png';
import './homepage.css';
import { Layout, Header, Navigation, Drawer, Content} from 'react-mdl';

class Homepage extends Component {
  render() {
    return(
      <div style={{width: '100%', margin: 'auto'}}>
      <div className="demo-big-content">
    <Layout>
        <Header className="header-color" title="WeShed" scroll>
        <img src={logo} className="App-logo" alt="Logo" />
            <Navigation>
                <a href="/">Home</a>
                <a href="/">Library</a>
                <a href="/">Friends</a>
                <a href="/">Settings</a>
            </Navigation>
        </Header>
        <Content>
            <div className="feed"/>
            Media Feed Placeholder
        </Content>
    </Layout>
      </div>
      </div>
    );
  }
}

export default Homepage;
