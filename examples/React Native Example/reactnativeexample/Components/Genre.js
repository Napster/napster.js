import React from 'react';
import Player from './Player';
import GenreCalls from '../Models/GenreCalls';
import TrackCalls from '../Models/TrackCalls';
import Images from '../Models/Images'
import NavigationService from '../Models/NavigationService';
import {StyleSheet, Text, View, Image, ScrollView, FlatList, Button, TouchableOpacity} from 'react-native';

export default class Genre extends React.Component {
  //BUTTON NOT WORKING
  static navigationOptions = {
    headerRight: (
      <Button
        onPress={() =>{ this.playerNavigate() }}
        title="Player"
        color="#2ca6de"
      />
    ),
  };
  constructor(props) {
    _isMounted = false;
    super(props);
    this.state = {
      genres: [],
      tracks: [],
    };
  }

  componentDidMount() {
    this._isMounted = true;

    this.loadGenres(this.props.navigation.state.params.access_token);
    // Napster = window.Napster;
  }

  // BUTTON IS NOT WORKING
  playerNavigate(){
    if(this.state.tracks){
      const {navigate} = this.props.navigation;
      NavigationService.navigate('Player', { tracks: tracks });
    }
  }

  loadGenres(token) {
    return GenreCalls.getGenres(token)
      .then(genres => {
        if (this._isMounted) {
          if (this.state.genres !== genres) {
            this.setState({ genres });
          }
        }
      })
      .catch(err => Error(err, "Loading Genres"));
  }

  chooseTrackList(token, genre) {
    return TrackCalls.getTracks(token, genre)
      .then(tracks => {
        if (this.state.tracks !== tracks) {
          this.setState({ tracks });
        }
        const {navigate} = this.props.navigation;
        NavigationService.navigate('Player', { tracks: tracks });
      })
      .catch(err => Error(err, "Loading Tracks"));
  }

  render() {
    const genreList = this.state.genres.map(genre => (
      <TouchableOpacity key={genre.id} style={styles.container} onPress={() => { this.chooseTrackList(this.props.navigation.state.params.access_token, genre.id); }}>
        <Image source={Images[genre.id]} style={styles.genreImage}/>
        <Text style={styles.genreText}>{genre.name.toUpperCase()}</Text>
      </TouchableOpacity>
    ));

    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.welcomeText}>WELCOME</Text>
          <Text style={styles.messageText}>Select any genre to start listening!</Text>
        </View>
        <Text></Text>
        <View style={styles.container}>
         {genreList}
        </View>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  genreText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2ca6de',
    justifyContent: 'center',
    alignItems: 'center'
  },
  genreImage: {
    width: 350,
    height: 175,
  },
  welcomeText: {
    fontSize: 45,
    fontWeight: '500',
    color: '#2ca6de',
  },
  messageText: {
    fontSize: 20,
    color: '#2ca6de',
  }
});
