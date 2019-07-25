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
    if (this.props.navigation.state.params.selectedTrack && track.type === "track") {
      if (this.props.navigation.state.params.currentTrackId === track.id.toLowerCase()) {
        if (this.props.navigation.state.params.playing === false) {
          this.props.isPlaying(true);
          // Napster.player.resume(track.id);
        } else if (this.props.navigation.state.params.playing === true) {
          this.props.isPlaying(false);
          // Napster.player.pause();
        }
      } else {
        if (this.props.navigation.state.params.playing === true) {
          this.props.isPlaying(false);
          // Napster.player.pause();
        } else {
          this.props.currentTrack(track.id);
          this.props.isPlaying(true);
          // Napster.player.play(track.id);
        }
      }
    } else {
      return '';
    }
  }

  shuffle(trackList) {
    if (this.props.navigation.state.params.selectedTrack && this.props.navigation.state.params.selectedTrack.type === "track") {
      if (this.props.navigation.state.params.shuffle === false) {
        const shuffledQueue = [...trackList].sort(() => Math.random() - 0.5);
        this.props.isShuffled(true);
        this.props.updateQueue(shuffledQueue);
      } else {
        this.props.isShuffled(false);
        this.props.updateQueue(this.props.navigation.state.params.queueHolder);
      }
    } else {
      return '';
    }
  }

  nextPrev(cmd, track) {
    if (this.props.navigation.state.params.selectedTrack && track.type === "track") {
      const index = this.props.navigation.state.params.queue.map(e => e.id).indexOf(track.id);
      if (cmd === "next") {
        if (index !== 9) {
          this.props.songMovement(this.props.navigation.state.params.queue[index + 1]);
          this.props.isPlaying(true);
          this.props.currentTrack(track.id);
          // Napster.player.play(this.props.queue[index + 1].id);
        } else {
          this.props.songMovement(this.props.navigation.state.params.queue[0]);
          this.props.isPlaying(true);
          this.props.currentTrack(track.id);
          // Napster.player.play(this.props.queue[0].id);
        }
      } else if (cmd === "prev") {
        if (index !== 0) {
          this.props.songMovement(this.props.navigation.state.params.queue[index - 1]);
          this.props.isPlaying(true);
          this.props.currentTrack(track.id);
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
    if (this.props.navigation.state.params.repeat === false) {
      this.props.songRepeat(true);
      this.props.trackAutoplay(false);
    } else {
      this.props.songRepeat(false);
      this.props.trackAutoplay(true);
    }
  }

  trackSelected = (track) => {
    this.props.navigation.state.params.select(track)
    this.forceUpdate();
  }


  render() {
    console.log(this.props.navigation.state.params.selectedTrack, "132")
    const trackList = this.props.navigation.state.params.tracks.map(track => (
      <View style={styles.trackContainer} key={track.id} >
        <TouchableOpacity style={styles.container} onPress={() => { this.trackSelected(track) }}>
          <Image style={styles.image} source={{ uri:`https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/500x500.jpg` }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { this.props.navigation.getParam('select')(track); }}>
          <Text style={styles.text}>{track.name}</Text>
          <Text style={styles.text}>{track.artistName}</Text>
        </TouchableOpacity>
      </View>
    ));

    const queueList = this.props.navigation.state.params.queue.map(track => (
      <View style={styles.trackContainer} key={track.id} >
        <TouchableOpacity style={styles.container} onPress={() => { params.select(track); }}>
          <Image style={styles.image} source={{ uri:`https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/500x500.jpg` }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { this.props.navigation.getParam('select')(track); }}>
          <Text style={styles.text}>{track.name}</Text>
          <Text style={styles.text}>{track.artistName}</Text>
        </TouchableOpacity>
      </View>
    ));

    const select = (
      <View style={styles.trackContainer}>
        <View style={styles.container}>
          <Image style={styles.trackImage} source={{ uri:`https://api.napster.com/imageserver/v2/albums/${this.props.navigation.state.params.selectedTrack && this.props.navigation.state.params.selectedTrack.albumId}/images/500x500.jpg` }} />
        </View>
        <View>
          <Text style={styles.track}>{this.props.navigation.state.params.selectedTrack && this.props.navigation.state.params.selectedTrack.name}</Text>
          <Text style={styles.track}>{this.props.navigation.state.params.selectedTrack && this.props.navigation.state.params.selectedTrack.artistName}</Text>
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
          {this.props.navigation.state.params.selectedTrack && this.props.navigation.state.params.selectedTrack.type === "track" ? (<View>{select}</View>) : (<View>{imgPlaceHolder}</View>)}
          <ProgressBar {...this.props.navigation.state.params} />
          <View style={styles.buttonContainer}>
            <Icon name='repeat' type='font-awesome' color={this.props.navigation.state.params.repeat ? '#ffffff' : '#517fa4'} onPress={() => this.repeat()}/>
            <Icon name='reorder' type='font-awesome' color={this.props.navigation.state.params.isShowing ? '#ffffff' : '#517fa4'} onPress={() => this.props.showQueue() }/>
            <Icon name='step-backward' type='font-awesome' color='#517fa4' onPress={() => { this.nextPrev("prev", this.props.navigation.state.params.selectedTrack); }}/>
            <Icon name={this.props.navigation.state.params.playing ? "pause" : "play"} type='font-awesome' color='#517fa4' onPress={() => { this.playPauseResume(this.props.navigation.state.params.selectedTrack); }}/>
            <Icon name='step-forward' type='font-awesome' color='#517fa4' onPress={() => { this.nextPrev("next", this.props.navigation.state.params.selectedTrack); }}/>
            <Icon name='random' type='font-awesome' color={this.props.navigation.state.params.shuffle ? '#ffffff' : '#517fa4'} onPress={() => { this.shuffle(this.props.navigation.state.params.queue); }}/>
          </View>
        </View>
        <View>
          {this.props.navigation.state.params.isShowing ? (<View>{queueList}</View>) : (<View>{trackList}</View>)}
        </View>
      </ScrollView>
    );
  }
};
