import React from 'react';
import { Slider } from 'react-native-elements';
import { styles } from '../Styles/ProgressBar.styles.js'
import { Text, View, Image, ScrollView} from 'react-native';

// let Napster;

export default class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    Napster = window.Napster;
  }

  calculateTotalValue(track) {
    if (this.props.selectedTrack && track.type === "track") {
      const length = track.playbackSeconds;
      const minutes = Math.floor(length / 60);
      let seconds = track.playbackSeconds % 60;
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }
      return `${minutes}:${seconds}`;
    } else {
      return "0:00";
    }
  }

  normalizeTime = t => {
    if (this.props.selectedTrack && this.props.selectedTrack.type === "track") {
      if (t === undefined) {
        return "0:00";
      } else {
        const time = Math.floor(t);
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        if (seconds < 10) {
          seconds = `0${seconds}`;
        }
        const timeout = `${minutes}:${seconds}`;
        return timeout;
      }
    } else {
      return "0:00";
    }
  }

  seek = event => {
    if (this.props.playing) {
      if (this.props.selectedTrack && this.props.selectedTrack.type === "track") {
        //Napster.player.seek(event.target.value);
        return event.target.value;
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Slider thumbStyle={styles.thumbSlider} type="range" id="progress" minimumValue={0} maximumValue={this.props.totalTime} step={0} onValueChange={this.seek} value={this.props.currentTime} />
        <Text style={styles.barText}>
          {` ${this.normalizeTime(this.props.currentTime)}/${this.calculateTotalValue(this.props.selectedTrack)}`}
        </Text>
      </View>
    );
  }
}
