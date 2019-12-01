import React, { Component, Fragment} from 'react';
import Auth from './Auth';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import DI from './config/domain_info';
import './Header.css';

class Header extends Component {

  constructor(props) {
    super(props);

    this.state = {
      song_arr: []
    }
  }

  componentDidMount(){
    var obj;
		fetch(DI.DOMAIN + '/get_songs')
    .then(response => response.json())
    .then(data => obj = data)
		.then( () => this.setState({ song_arr: obj }));
  }

  getLogout(){
    Auth.signout();
  }

  render() {

    let header;
      header = <div className="Header">
        <Link to='Home'>Home</Link><br/>
        <Link to='Playlists'>Playlists</Link><br/>
        <Link to='Songs'>Songs</Link><br/>
        <Link to='Profile'>Profile</Link><br/>
        <Link to='Stats'>Stats</Link><br/>
           <div className="searchBar">  <Autocomplete
           suggestions={this.state.song_arr}/>
           </div>
           <Link to='Login' className='logout' onClick={this.getLogout}>Logout</Link>
      </div>
    
    return (
      <div>
       {header}
      </div>
    );
  }
}

class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array)
  };

  static defaultProps = {
    suggestions: []
  };

  constructor(props) {
    super(props);

    this.state = {
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
      // What the user has entered
      userInput: "",
      active: (props.locked && props.active) || false,
    };

  }

  // Event fired when the input value is changed
  onChange = e => {
    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;

    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter(
      suggestion =>
        suggestion.Name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    // Update the user input and filtered suggestions, reset the active
    // suggestion and make sure the suggestions are shown
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value
    });
  };

  onClick = e => {
    // Update the user input and reset the rest of the state
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: ""
    });
  };


  // Event fired when the user presses a key down
  onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    // User pressed the enter key, update the input and close the
    // suggestions
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion]
      });
    }
    // User pressed the up arrow, decrement the index
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.Name.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput
      }
    } = this;
    const {active} = this.state;
    const {locked} = this.props;
    const fieldClassName = `field ${(locked ? active : active || this.state.curr_name) && 'active'} ${locked && !active && 'locked'}`;
    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul class="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

              return (
                <li
                  className={className}
                  key={suggestion}
                  onClick={onClick}
                >
                {<Link to={{
                  pathname: 'Songs',
                  state: {
                    Msid: suggestion.Msid,
                    Name: suggestion.Name,
                    F_handle: suggestion.F_handle,
                    Bt_ref: suggestion.Bt_ref
                  }
                }}>{suggestion.Name}</Link>}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div class="no-suggestions">
            <em>No suggestions, you're on your own!</em>
          </div>
        );
      }
    }

    return (
      <div className={fieldClassName}>

          <form ref="form">
            <input id="input"
            type="text"
            placeholder="Search for song..."
            onChange={this.onChange}
            onClick={this.onClick}
            onKeyDown={this.onKeyDown}
            onFocus={() => !locked && this.setState({ active : true })}
            onBlur={() => !locked && this.setState({ active: false })}
            />
          </form>
          {suggestionsListComponent}
        </div>
    );
  }
}

export {Header, Autocomplete};
