import React from 'react';
import './App.css';
const {Napster} = window;



export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      access_token: '',
      refresh_token: '',
      tracks: []
    };
  }

  componentDidMount() {
    const Napster = window.Napster;
    const detail_URL = new URL(window.location);
    const currentURL = detail_URL.href;
    const API_SECRET = 'NTE2NDgwNDYtMGY4NS00M2YyLThjNTEtYWM4ZWE1N2E5NWE4';
    const API_KEY = 'NzQ3NjI1Y2MtYmY0Yy00YjVhLTgwYmItNjU5ZTI5YTU3Yzg2';

    if (detail_URL.search === '') {
      window.location = `https://api.napster.com/oauth/authorize?client_id=${API_KEY}&redirect_uri=${currentURL}&response_type=code`;
    } else if (detail_URL.search.includes('code')) {
      console.log(Napster);


      Napster.init({ consumerKey: API_KEY, isHTML5Compatible: true });

      const code = detail_URL.search.substring(6);
      fetch(`https://api.napster.com/oauth/access_token?client_id=${API_KEY}&client_secret=${API_SECRET}&response_type=code&grant_type=authorization_code&redirect_uri=${currentURL}&code=${code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(result => {
        return result.json();
      })
      .then(result => {
        // console.log('Auth Token:', result.access_token, 'Refresh', result.refresh_token);


        Napster.player.on('ready', function(e) {
          Napster.member.set({
            accessToken: result.access_token,
            refreshToken: result.refresh_token
          });

          //console.log('napster inside ready', Napster);
        });


        this.setState({
          access_token: result.access_token,
          refresh_token: result.refresh_token
        });

      })
      .then(result => {
        //console.log('heres nap', Napster);
        return fetch('https://api.napster.com/v2.2/tracks/top?limit=10', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.state.access_token}`,
            'content-type': 'application/json'
          }
        })
        .then(response => {
          return response.json();
        })
        .then(response => {
          response.tracks.map((track) => (
            fetch(`https://api.napster.com/v2.2/albums/${track.albumId}/images`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${this.state.access_token}`,
                'content-type': 'application/json'
              }
            })
            .then(answer => {
              return answer.json();
            })
            .then(answer => {

              Napster.player.queue(track.id);

              this.setState({ tracks: [...this.state.tracks, {id: track.id, name: track.name, artistName: track.artistName, previewURL: track.previewURL, image: answer.images[0].url}]});
            })
          ));
        })
      })
    }
  }

  render() {
    const songList = this.state.tracks.slice(0).reverse().map((track) => (
      <li key={track.id} className="track" onClick={() => Napster.player.play(track.id)}>
        <img src={track.image} alt="Album Art"></img>
        <p className="track-name">{track.name}</p>
        <p className="artist-name">{track.artistName}</p>
      </li>
    ));



    return (
      <div className="App">
        <header className="App-header">
          <h1>Fiilpp's napster.js React App</h1>
          <h3>Check Out Top Hits of Today!</h3>
          <section className="Button-container">
            <button className="Player-button" onClick={() => Napster.player.next()}>Next</button>
            <button className="Player-button" onClick={() => Napster.player.previous()}>Previous</button>
            <button className="Player-button" onClick={() => Napster.player.pause()}>Stop</button>
          </section>
          <ul className="Track-list">
            {songList}
          </ul>
        </header>
      </div>
    );
  }
}
