import React from 'react';
import Player from './Player';
import GenreCalls from '../Models/GenreCalls';
import TrackCalls from '../Models/TrackCalls';

let Napster;

export default class Genre extends React.Component {
  constructor(props) {
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
      sessionError: false
    };
  }

  componentDidMount() {
    this.loadGenres(this.props.token);
    Napster = window.Napster;
    Napster.player.on('playsessionexpired', () => {
      this.isPlaying(false);
      Napster.player.pause();
      this.setState({ currentTime: 0, sessionError: true });
    });
    Napster.player.on('playtimer', e => {
      this.setState({
        currentTime: e.data.currentTime,
        totalTime: e.data.totalTime
      });
      if (this.state.repeat) {
        if (Math.floor(this.state.currentTime) === this.state.totalTime) {
          Napster.player.play(this.state.selectedTrack.id);
        }
      }
      if (this.state.autoplay && Object.keys(this.state.selectedTrack).length !== 0) {
        if (Math.floor(this.state.currentTime) === this.state.totalTime) {
          const index = this.state.queue.map(q => q.id).indexOf(this.state.selectedTrack.id);
          if (index !== 9) {
            this.songMovement(this.state.queue[index + 1]);
            this.currentTrack(this.state.selectedTrack.id);
            Napster.player.play(this.state.queue[index + 1].id);
          } else {
            this.songMovement(this.state.queue[0]);
            this.currentTrack(this.state.selectedTrack.id);
            Napster.player.play(this.state.queue[0].id);
          }
        }
      }
    });
  }

  loadGenres(token) {
    return GenreCalls.getGenres(token)
      .then(genres => {
        if (this.state.genres !== genres) {
          this.setState({ genres });
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

  select(track) {
    this.setState({ selectedTrack: track, sessionError: false }, () => {
      Napster.player.play(track.id);
      this.isPlaying(true);
      this.setState({ currentTrackId: track.id });
      const inQueue = this.state.queue.find(tr => track.id === tr.id);
      if (!inQueue) {
        this.setState({ queueHolder: this.state.tracks });
        this.setState({ queue: this.state.tracks }, () => {
          if (this.state.shuffle) {
            const shuffledQueue = [...this.state.queue].sort(() => Math.random() - 0.5);
            this.updateQueue(shuffledQueue);
          }
        });
      }
    });
  }

  isPlaying = cmd => {
    this.setState({ playing: cmd });
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
      <div role="button" tabIndex={0} className="genre-btn" key={genre.id} onClick={() => { this.chooseTrackList(this.props.token, genre.id); }} onKeyPress={this.handleKeyPress}>
        <img src={require(`../genreimages/${genre.id}.jpg`)} alt="Genre Art" />
        <h3>{genre.name.toUpperCase()}</h3>
      </div>
    ));

    const trackList = this.state.tracks.map(track => (
      <div role="button" tabIndex={0} id="track" className="content" style={{ display: (this.state.isShowing ? 'none' : 'content') }} key={track.id} onClick={() => { this.select(track); }} onKeyPress={this.handleKeyPress}>
        <img src={`https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/500x500.jpg`} alt="Album Art" />
        <div className="text">
          <h3><strong>{track.name}</strong></h3>
          <p>{track.artistName}</p>
        </div>
      </div>
    ));

    const queueList = this.state.queue.map(track => (
      <div role="button" tabIndex={0} id="queue" className="content" style={{ display: (this.state.isShowing ? 'content' : 'none') }} key={track.id} onClick={() => { this.select(track); }} onKeyPress={this.handleKeyPress}>
        <img src={`https://api.napster.com/imageserver/v2/albums/${track.albumId}/images/500x500.jpg`} alt="Album Art" />
        <div className="text">
          <h3><strong>{track.name}</strong></h3>
          <p>{track.artistName}</p>
        </div>
      </div>
    ));

    return (

      <div id="parent">
        <div id="narrow">
          <Player
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
          />
          <div id='errorDiv' hidden={!this.state.sessionError}>
            Playback session expired by another client
            <button type='button' id='errorBtn' onClick={() => { this.select(this.state.selectedTrack); }}>Continue</button>
          </div>
          {this.state.isShowing && (
            <div align="center" id="queue">
              <p className="queue">Your Queue</p>
              {queueList}
            </div>
          )}
          {!this.state.isShowing && (<div align="center" id="track">{trackList}</div>)}
        </div>
        <div id="wide">
          <h1 className="header">WELCOME</h1>
          <h2 className="message">Select any genre to start listening!</h2>
          <br />
          <ul>{genreList}</ul>
        </div>
      </div>
    );
  }
}
