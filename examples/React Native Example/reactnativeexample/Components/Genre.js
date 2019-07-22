import React from 'react';
import Player from './Player';
import GenreCalls from '../Models/GenreCalls';
import TrackCalls from '../Models/TrackCalls';
import {StyleSheet, Text, View, Image, ScrollView, FlatList} from 'react-native';

export default class Genre extends React.Component {
  constructor(props) {

    _isMounted = false;
    super(props);
    this.state = {
      genres: [],
      tracks: [],
      queue: [],
      queueHolder: [],
      selectedTrack: {},
      playing: false,
      shuffle: false,
      isShowing: false,
      currentTime: 0,
      totalTime: 0,
      currentTrackId: "",
      repeat: false,
      autoplay: true,
    };
  }

  componentDidMount() {
    this._isMounted = true;

    this.loadGenres(this.props.navigation.state.params.access_token);
    // Napster = window.Napster;
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
      })
      .catch(err => Error(err, "Loading Tracks"));
  }

  render() {
    const genreList = this.state.genres.map(genre => (
      <View key={genre.id} styles={styles.container} onPress={() => { this.chooseTrackList(this.props.navigation.state.params.access_token, genre.id); }}>
        <Image source={require(`../genreimages/g.115.jpg`)} style={styles.genreImage}/>
        <Text style={styles.genreText}>{genre.name.toUpperCase()}</Text>
      </View>
    ));

    const trackList = this.state.tracks.map(track => (
      <View role="button" id="track" styles={styles.container} key={track.id}>
        <Image source={`https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/500x500.jpg`} alt="Album Art" />
        <View>
          <Text><strong>{track.name}</strong></Text>
          <Text>{track.artistName}</Text>
        </View>
      </View>
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
