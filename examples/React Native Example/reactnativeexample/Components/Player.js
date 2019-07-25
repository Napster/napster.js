import React from 'react';
import ProgressBar from './ProgressBar';
import { Icon } from 'react-native-elements';
import NavigationService from '../Models/NavigationService';
import { styles } from '../Styles/Player.styles.js'
import { Text, View, Image, ScrollView, FlatList, TouchableOpacity, Button } from 'react-native';

export default class Player extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <Button
          onPress={ navigation.getParam('handleSwitch') }
          title="Genres"
          color="#2ca6de"
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
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
    const { state, setParams, navigate } = this.props.navigation;
    const params = state.params || {};

    this.props.navigation.setParams({
      handleSwitch: this.playerNavigate,
     });
  }

  playerNavigate = () => {
    const { navigate } = this.props.navigation;
    NavigationService.navigate('Genre');
  }

  playPauseResume(track) {
    if (this.state.selectedTrack && track.type === "track") {
      if (this.state.currentTrackId === track.id.toLowerCase()) {
        if (this.state.playing === false) {
          this.isPlaying(true);
          // Napster.player.resume(track.id);
        } else if (this.state.playing === true) {
          this.isPlaying(false);
          // Napster.player.pause();
        }
      } else {
        if (this.state.playing === true) {
          this.isPlaying(false);
          // Napster.player.pause();
        } else {
          this.currentTrack(track.id);
          this.isPlaying(true);
          // Napster.player.play(track.id);
        }
      }
    } else {
      return '';
    }
  }

  shuffle(trackList) {
    if (this.state.selectedTrack.type === "track") {
      if (this.state.shuffle === false) {
        const shuffledQueue = [...trackList].sort(() => Math.random() - 0.5);
        this.isShuffled(true);
        this.updateQueue(shuffledQueue);
      } else {
        this.isShuffled(false);
        this.updateQueue(this.props.navigation.state.params.queueHolder);
      }
    } else {
      return '';
    }
  }

  nextPrev(cmd, track) {
    if (track.type === "track") {
      const index = this.state.queue.map(e => e.id).indexOf(track.id);
      if (cmd === "next") {
        if (index !== 9) {
          this.songMovement(this.state.queue[index + 1]);
          this.isPlaying(true);
          this.currentTrack(track.id);
          // Napster.player.play(this.props.queue[index + 1].id);
        } else {
          this.songMovement(this.state.queue[0]);
          this.isPlaying(true);
          this.currentTrack(track.id);
          // Napster.player.play(this.props.queue[0].id);
        }
      } else if (cmd === "prev") {
        if (index !== 0) {
          this.songMovement(this.state.queue[index - 1]);
          this.isPlaying(true);
          this.currentTrack(track.id);
          // Napster.player.play(this.props.queue[index - 1].id);
        } else {
          // Napster.player.play(this.props.selectedTrack.id);
        }
      }
    } else {
      return '';
    }
  }

  repeat() {
    if (this.state.repeat === false) {
      this.songRepeat(true);
      this.trackAutoplay(false);
    } else {
      this.songRepeat(false);
      this.trackAutoplay(true);
    }
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
    const trackList = this.props.navigation.state.params.tracks.map(track => (
      <View style={styles.trackContainer} key={track.id} >
        <TouchableOpacity style={styles.container} onPress={() => { this.select(track) }}>
          <Image style={styles.image} source={{ uri:`https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/500x500.jpg` }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { this.select(track); }}>
          <Text style={styles.text}>{track.name}</Text>
          <Text style={styles.text}>{track.artistName}</Text>
        </TouchableOpacity>
      </View>
    ));

    const queueList = this.state.queue.map(track => (
      <View style={styles.trackContainer} key={track.id} >
        <TouchableOpacity style={styles.container} onPress={() => { this.select(track); }}>
          <Image style={styles.image} source={{ uri:`https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/500x500.jpg` }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { this.select(track); }}>
          <Text style={styles.text}>{track.name}</Text>
          <Text style={styles.text}>{track.artistName}</Text>
        </TouchableOpacity>
      </View>
    ));

    const select = (
      <View style={styles.trackContainer}>
        <View style={styles.container}>
          <Image style={styles.trackImage} source={{ uri:`https://api.napster.com/imageserver/v2/albums/${this.state.selectedTrack.albumId}/images/500x500.jpg` }} />
        </View>
        <View>
          <Text style={styles.track}>{this.state.selectedTrack.name}</Text>
          <Text style={styles.track}>{this.state.selectedTrack.artistName}</Text>
        </View>
      </View>
    );

    const imgPlaceHolder = (
      <View style={styles.trackContainer}>
        <View style={styles.container}>
          <Image style={styles.trackImage} source={{ uri:"https://www.logolynx.com/images/logolynx/63/63b7e09aff8bbe832d22c752c4bef080.jpeg" }} />
        </View>
        <View>
          <Text style={styles.track}>Track</Text>
          <Text style={styles.track}>Artist</Text>
        </View>
      </View>
    );

    return (
      <ScrollView style={styles.color}>
        <View>
          {this.state.selectedTrack.type === "track" ? (<View>{select}</View>) : (<View>{imgPlaceHolder}</View>)}
          <ProgressBar {...this.state} />
          <View style={styles.buttonContainer}>
            <Icon name='repeat' type='font-awesome' color={this.state.repeat ? '#ffffff' : '#517fa4'} onPress={() => this.repeat()}/>
            <Icon name='reorder' type='font-awesome' color={this.state.isShowing ? '#ffffff' : '#517fa4'} onPress={() => this.showQueue() }/>
            <Icon name='step-backward' type='font-awesome' color='#517fa4' onPress={() => { this.nextPrev("prev", this.state.selectedTrack); }}/>
            <Icon name={this.state.playing ? "pause" : "play"} type='font-awesome' color='#517fa4' onPress={() => { this.playPauseResume(this.state.selectedTrack); }}/>
            <Icon name='step-forward' type='font-awesome' color='#517fa4' onPress={() => { this.nextPrev("next", this.state.selectedTrack); }}/>
            <Icon name='random' type='font-awesome' color={this.state.shuffle ? '#ffffff' : '#517fa4'} onPress={() => { this.shuffle(this.state.queue); }}/>
          </View>
        </View>
        <View>
          {this.state.isShowing ? (<View>{queueList}</View>) : (<View>{trackList}</View>)}
        </View>
      </ScrollView>
    );
  }
};
