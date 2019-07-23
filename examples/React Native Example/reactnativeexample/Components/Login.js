import React from 'react';
import Genre from './Genre';
import Auth from '../Models/Auth';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import NavigationService from '../Models/NavigationService';

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      access_token: '',
      email: '',
      password: '',
    };
  }

  onChangeText = (key, val) => {
    this.setState({[key]: val})
  }

  validateLogin = (email, password) => {
    return Auth.authenticate(email, password)
      .then(result => {
        if (result.access_token) {
          if (this.state.access_token !== result.access_token) {
            this.setState({ access_token: result.access_token });
          }
        alert("Login Successful!")
        const {navigate} = this.props.navigation;
        NavigationService.navigate('Genre', { access_token: this.state.access_token });
        } else {
          alert(result.message)
        }
      })
      .catch(err => Error(err, "Trouble Getting Token"));
  }

  render() {
    return (
      <View style={styles.container}>
          <Text style={styles.headerText}>Napster Example</Text>
          <Text></Text>
          <TextInput style={styles.inputBox}
          onChangeText={(value) => this.onChangeText('email', value)}
          underlineColorAndroid='rgba(0,0,0,0)'
          placeholder="Email"
          placeholderTextColor = "#002f6c"
          selectionColor="#fff"
          keyboardType="email-address"
          />

          <TextInput style={styles.inputBox}
          onChangeText={(value) => this.onChangeText('password', value)}
          underlineColorAndroid='rgba(0,0,0,0)'
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor = "#002f6c"
          />

          <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText} onPress={() => { this.validateLogin(this.state.email, this.state.password); }}>Login</Text>
          </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    inputBox: {
        width: 300,
        backgroundColor: '#eeeeee',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#002f6c',
        marginVertical: 10
    },
    button: {
        width: 300,
        backgroundColor: '#2ca6de',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 12
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center'
    },
    headerText: {
        fontSize: 24,
        fontWeight: '500',
        color: '#2ca6de',
        textAlign: 'center'
    }
});
