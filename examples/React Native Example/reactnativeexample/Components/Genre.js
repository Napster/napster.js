import React from 'react';
import Player from './Player';
import GenreCalls from '../Models/GenreCalls';
import TrackCalls from '../Models/TrackCalls';
import Images from '../Models/Images'
import NavigationService from '../Models/NavigationService';
import { styles } from '../Styles/Genre.styles.js'
import { Text, View, Image, ScrollView, FlatList, Button, TouchableOpacity, BackHandler } from 'react-native';

export default class Genre extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <Button
          onPress={ navigation.getParam('handleSwitch') }
          title={"Player"}
          color="#2ca6de"
        />
      ),
      headerLeft: null
    };
  };

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
      totalTime: 10,
      currentTrackId: "",
      repeat: false,
      autoplay: true,
      genrePage: true,
    };
  }

  componentDidMount() {
    this._isMounted = true;

    this.loadGenres(this.props.navigation.state.params.access_token);
    this.props.navigation.setParams({ handleSwitch: this.playerNavigate, genrePage: this.state.genrePage });

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    // Napster = window.Napster;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    return true;
  }


  playerNavigate = () => {
    if(this.state.genrePage) {
      this.setState({ genrePage: false });
    }else{
      this.setState({ genrePage: true });
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
        this.setState({ genrePage: false });
      })
      .catch(err => Error(err, "Loading Tracks"));
  }

  select = (track) => {
    this.setState({ selectedTrack: track }, () => {
      // Napster.player.play(track.id);
      this.isPlaying(true);
      this.setState({ currentTrackId: track.id });
      const inQueue = this.state.queue.find(tr => track.id === tr.id);
      if (!inQueue) {
        this.setState({ queueHolder: this.state.tracks });
        this.setState({ queue: this.state.tracks }, () => {
          if (this.state.shuffle) {
            const shuffledQueue = [...this.state.queue].sort(() => Math.random() - 0.5);
            this.setState({ queue: shuffledQueue });
          }
        });
      }
    });
  }

  isPlaying = cmd => {
    this.setState({ playing: cmd });
    if (cmd === true) {
      // Napster.player.on('playtimer', e => {
      //   this.setState({
      //     currentTime: e.data.currentTime,
      //     totalTime: e.data.totalTime
      //   });
        if (this.state.repeat) {
          if (Math.floor(this.state.currentTime) === this.state.totalTime) {
            // Napster.player.play(this.state.selectedTrack.id);
          }
        }
        if (this.state.autoplay) {
          if (Math.floor(this.state.currentTime) === this.state.totalTime) {
            const index = this.state.queue.map(q => q.id).indexOf(this.state.selectedTrack.id);
            if (index !== 9) {
              this.setState({ selectedTrack: this.state.queue[index + 1] });
              this.setState({ currentTrackId: this.state.selectedTrack.id});
              // Napster.player.play(this.state.queue[index + 1].id);
            } else {
              this.setState({ selectedTrack: this.state.queue[0] });
              this.setState({ currentTrackId: this.state.selectedTrack.id });
              // Napster.player.play(this.state.queue[0].id);
            }
          }
        }
      // });
    }
  }

  currentTrack = id => { this.setState({ currentTrackId: id }); }

  isShuffled = cmd => { this.setState({ shuffle: cmd }); }

  updateQueue = newQueue => { this.setState({ queue: newQueue }); }

  songMovement = index => { this.setState({ selectedTrack: index }); }

  songRepeat = cmd => { this.setState({ repeat: cmd }); }

  trackAutoplay = cmd => { this.setState({ autoplay: cmd }); }

  showQueue = () => {
    if (this.state.selectedTrack.type === "track") {
      if (this.state.isShowing === false) {
        this.setState({ isShowing: true });
      } else {
        this.setState({ isShowing: false });
      }
    } else {
      return "";
    }
  }

  render() {
    const genreList = this.state.genres.map(genre => (
      <TouchableOpacity key={genre.id} style={styles.container} onPress={() => { this.chooseTrackList(this.props.navigation.state.params.access_token, genre.id); }}>
        <Image source={Images[genre.id]} style={styles.genreImage}/>
        <Text style={styles.genreText}>{genre.name.toUpperCase()}</Text>
      </TouchableOpacity>
    ));

    return (
      <View>
      {this.state.genrePage ?
      (<ScrollView>
        <View style={styles.container}>
          <Text style={styles.welcomeText}>WELCOME</Text>
          <Text style={styles.messageText}>Select any genre to start listening!</Text>
        </View>
        <Text></Text>
        <View style={styles.container}>
         {genreList}
        </View>
      </ScrollView>) :
      (<Player
        tracks={this.state.tracks}
        selectedTrack={this.state.selectedTrack}
        playing={this.state.playing}
        shuffle={this.state.shuffle}
        updateQueue={this.updateQueue}
        songMovement={this.songMovement}
        queue={this.state.queue}
        queueHolder={this.state.queueHolder}
        showQueue={this.showQueue}
        isPlaying={this.isPlaying}
        isShuffled={this.isShuffled}
        isShowing={this.state.isShowing}
        currentTime={this.state.currentTime}
        totalTime={this.state.totalTime}
        currentTrackId={this.state.currentTrackId}
        currentTrack={this.currentTrack}
        songRepeat={this.songRepeat}
        repeat={this.state.repeat}
        trackAutoplay={this.trackAutoplay}
        select={this.select}
        />)}
      </View>
    );
  }
};
