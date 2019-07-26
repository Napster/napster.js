import React from 'react';
import ProgressBar from './ProgressBar';
import { Icon } from 'react-native-elements';
import NavigationService from '../Models/NavigationService';
import { styles } from '../Styles/Player.styles.js'
import { Text, View, Image, ScrollView, FlatList, TouchableOpacity, Button } from 'react-native';

export default class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  playPauseResume(track) {
    if (track.type === "track") {
      if (this.props.currentTrackId === track.id.toLowerCase()) {
        if (this.props.playing === false) {
          this.props.isPlaying(true);
          // Napster.player.resume(track.id);
        } else if (this.props.playing === true) {
          this.props.isPlaying(false);
          // Napster.player.pause();
        }
      } else {
        if (this.props.playing === true) {
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
    if (this.props.selectedTrack.type === "track") {
      if (this.props.shuffle === false) {
        const shuffledQueue = [...trackList].sort(() => Math.random() - 0.5);
        this.props.isShuffled(true);
        this.props.updateQueue(shuffledQueue);
      } else {
        this.props.isShuffled(false);
        this.props.updateQueue(this.props.queueHolder);
      }
    } else {
      return '';
    }
  }

  nextPrev(cmd, track) {
    if (track.type === "track") {
      const index = this.props.queue.map(e => e.id).indexOf(track.id);
      if (cmd === "next") {
        if (index !== 9) {
          this.props.songMovement(this.props.queue[index + 1]);
          this.props.isPlaying(true);
          this.props.currentTrack(track.id);
          // Napster.player.play(this.props.queue[index + 1].id);
        } else {
          this.props.songMovement(this.props.queue[0]);
          this.props.isPlaying(true);
          this.props.currentTrack(track.id);
          // Napster.player.play(this.props.queue[0].id);
        }
      } else if (cmd === "prev") {
        if (index !== 0) {
          this.props.songMovement(this.props.queue[index - 1]);
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
    if (this.props.repeat === false) {
      this.props.songRepeat(true);
      this.props.trackAutoplay(false);
    } else {
      this.props.songRepeat(false);
      this.props.trackAutoplay(true);
    }
  }

  render() {
    const trackList = this.props.tracks.map(track => (
      <TouchableOpacity style={styles.trackContainer} key={track.id} >
        <TouchableOpacity style={styles.container} onPress={() => { this.props.select(track) }}>
          <Image style={styles.image} source={{ uri:`https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/500x500.jpg` }} />
          <Text style={styles.queue}>{track.name}</Text>
          <Text style={styles.queue}>{track.artistName}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    ));

    const queueList = this.props.queue.map(track => (
      <View style={styles.trackContainer} key={track.id} >
        <TouchableOpacity style={styles.container} onPress={() => { this.props.select(track); }}>
          <Image style={styles.image} source={{ uri:`https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/500x500.jpg` }} />
          <Text style={styles.text}>{track.name}</Text>
          <Text style={styles.text}>{track.artistName}</Text>
        </TouchableOpacity>
      </View>
    ));

    const select = (
      <View style={styles.trackContainer}>
        <View style={styles.selectContainer}>
          <Image style={styles.trackImage} source={{ uri:`https://api.napster.com/imageserver/v2/albums/${this.props.selectedTrack && this.props.selectedTrack.albumId}/images/500x500.jpg` }} />
          <Text style={styles.track}>{this.props.selectedTrack && this.props.selectedTrack.name}</Text>
          <Text style={styles.track}>{this.props.selectedTrack && this.props.selectedTrack.artistName}</Text>
        </View>
      </View>
    );

    const imgPlaceHolder = (
      <View style={styles.trackContainer}>
        <View style={styles.selectContainer}>
          <Image style={styles.trackImage} source={{ uri:"https://www.logolynx.com/images/logolynx/63/63b7e09aff8bbe832d22c752c4bef080.jpeg" }} />
          <Text style={styles.track}>Track</Text>
          <Text style={styles.track}>Artist</Text>
        </View>
      </View>
    );

    return (
      <ScrollView style={styles.color}>
        <View>
          {this.props.selectedTrack && this.props.selectedTrack.type === "track" ? (<View>{select}</View>) : (<View>{imgPlaceHolder}</View>)}
          <ProgressBar {...this.props} />
          <View style={styles.buttonContainer}>
            <Icon name='repeat' type='font-awesome' size={30} color={this.props.repeat ? '#ffffff' : '#517fa4'} onPress={() => this.repeat()}/>
            <Icon name='reorder' type='font-awesome'  size={30} color={this.props.isShowing ? '#ffffff' : '#517fa4'} onPress={() => this.props.showQueue() }/>
            <Icon name='step-backward' type='font-awesome'  size={30} color='#517fa4' onPress={() => { this.nextPrev("prev", this.props.selectedTrack); }}/>
            <Icon name={this.props.playing ? "pause" : "play"} type='font-awesome'  size={30} color='#517fa4' onPress={() => { this.playPauseResume(this.props.selectedTrack); }}/>
            <Icon name='step-forward' type='font-awesome'  size={30} color='#517fa4' onPress={() => { this.nextPrev("next", this.props.selectedTrack); }}/>
            <Icon name='random' type='font-awesome'  size={30} color={this.props.shuffle ? '#ffffff' : '#517fa4'} onPress={() => { this.shuffle(this.props.queue); }}/>
          </View>
        </View>
        <View>
          {this.props.isShowing ? (
            <View>
              <Text style={styles.queue}>
                Your Queue
              </Text>
              {queueList}
            </View>)
          : (<View>{trackList}</View>)}
        </View>
      </ScrollView>
    );
  }
};
