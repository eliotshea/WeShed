import React, { Component } from 'react';
import { View, StatusBar, TextInput, Text } from 'react-native';
//npm install react-native-web

//Referenced https://facebook.github.io/react-native/docs/getting-started
class SearchBar extends Component{

	state = {
		isFocused: false,
	};
	handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

	render() {
    const { label, ...props } = this.props;
    const { isFocused } = this.state;
    const labelStyle = {
      position: 'absolute',
      left: 12,
      top: !isFocused ? 18 : 0,
      fontSize: !isFocused ? 17 : 14,
      color: !isFocused ? '#f2f2f2' : '#a6a6a6',
    };
    return (
      <View style={{ paddingTop: 18 }}>
        <Text style={labelStyle}>
          {label}
        </Text>
        <TextInput
          {...props}
          style={{	height: 25,
										width: 200,
										fontSize: 15,
                    color: '#f2f2f2',
					}}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
        />
      </View>
    );
  }
}

export default SearchBar;
