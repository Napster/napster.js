import React from 'react';
import ProgressBar from './ProgressBar';
import 'font-awesome/css/font-awesome.min.css';

let Napster;

export default class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    Napster = window.Napster;
  }

  playPauseResume(track) {
    if (track.type === "track") {
      if (this.props.currentTrackId === track.id.toLowerCase()) {
        if (this.props.playing === false) {
          this.props.isPlaying(true);
          Napster.player.resume(track.id);
        } else if (this.props.playing === true) {
          this.props.isPlaying(false);
          Napster.player.pause();
        }
      } else {
        if (this.props.playing === true) {
          this.props.isPlaying(false);
          Napster.player.pause();
        } else {
          this.props.currentTrack(track.id);
          this.props.isPlaying(true);
          Napster.player.play(track.id);
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
          Napster.player.play(this.props.queue[index + 1].id);
        } else {
          this.props.songMovement(this.props.queue[0]);
          this.props.isPlaying(true);
          this.props.currentTrack(track.id);
          Napster.player.play(this.props.queue[0].id);
        }
      } else if (cmd === "prev") {
        if (index !== 0) {
          this.props.songMovement(this.props.queue[index - 1]);
          this.props.isPlaying(true);
          this.props.currentTrack(track.id);
          Napster.player.play(this.props.queue[index - 1].id);
        } else {
          Napster.player.play(this.props.selectedTrack.id);
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
    const select = (
      <div className="select" style={{ display: (this.props.selectedTrack === "track" ? 'hide' : 'content') }} key={this.props.selectedTrack.id}>
        <img src={`https://api.napster.com/imageserver/v2/albums/${this.props.selectedTrack.albumId}/images/500x500.jpg`} alt="Album Art" />
        <div className="text">
          <h3><strong>{this.props.selectedTrack.name}</strong></h3>
          <p>{this.props.selectedTrack.artistName}</p>
        </div>
      </div>
    );

    const imgPlaceHolder = (
      <div className="select">
        <img src="https://www.logolynx.com/images/logolynx/63/63b7e09aff8bbe832d22c752c4bef080.jpeg" alt="NapsterCat" />
        <div className="text">
          <h3><strong>Track</strong></h3>
          <p>Artist</p>
        </div>
      </div>
    );

    return (
      <div align="center" className="demobox">
        {this.props.selectedTrack.type === "track" ? (<ul>{select}</ul>) : (<ul>{imgPlaceHolder}</ul>)}
        <ProgressBar
          selectedTrack={this.props.selectedTrack}
          currentTime={this.props.currentTime}
          totalTime={this.props.totalTime}
          playing={this.props.playing}
        />
        <br />
        <button type="button" className={this.props.repeat ? "player-toggle" : "player-btn"} title="Repeat" onClick={() => this.repeat()}><i className="fa fa-repeat" /></button>
        <button type="button" className={this.props.isShowing ? "player-toggle" : "player-btn"} title="Show Queue" onClick={() => { this.props.showQueue(); }}><i className="fa fa-reorder" /></button>
        <button type="button" title="Previous Song" className="player-btn" onClick={() => { this.nextPrev("prev", this.props.selectedTrack); }}><i className="fa fa-step-backward" /></button>
        <button type="button" title={this.props.playing ? "Pause" : "Play"} className="player-btn" onClick={() => { this.playPauseResume(this.props.selectedTrack); }}><i className={this.props.playing ? "fa fa-pause" : "fa fa-play"} /></button>
        <button type="button" title="Next Song" className="player-btn" onClick={() => { this.nextPrev("next", this.props.selectedTrack); }}><i className="fa fa-step-forward" /></button>
        <button type="button" className={!this.props.shuffle ? "player-btn" : "player-toggle"} title="Shuffle" onClick={() => { this.shuffle(this.props.queue); }}><i className="fa fa-random" /></button>
      </div>
    );
  }
}
