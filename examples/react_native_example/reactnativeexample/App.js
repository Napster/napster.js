import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import Login from './Components/Login';
import Genre from './Components/Genre';
import Player from './Components/Player';
import NavigationService from './Models/NavigationService';

const MainNavigator = createStackNavigator({
  Login: {screen: Login},
  Genre: {screen: Genre},
  Player: {screen: Player}
});

const AppContainer = createAppContainer(MainNavigator);

export default class App extends React.Component {
  render() {
    return (
      <AppContainer
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}
