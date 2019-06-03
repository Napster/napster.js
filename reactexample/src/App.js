import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
const {Napster} = window;


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: '',
      refreshToken: '',
      trackList: []
    };
  }
  //
  // async compontentDidMount(){
  //   await this.getVariables();
  //   await this.initalization(this.state);
  // }
  //
  // getVariables(){
  //   var query = window.location.search.substring(1);
  //   var variables = {};
  //      var vars = query.split("&");
  //      for (var i=0;i<vars.length;i++) {
  //              var pair = vars[i].split("=");
  //              variables[pair[0]] = pair[1];
  //      }
  //   this.setState({...variables});
  // }
  //
  // initalization = ({accessToken, refreshToken}) => {
  //   const APIKey = process.env.REACT_APP_API_KEY;
  //   const SecretKey = process.env.REACT_APP_SECRET_KEY;
  //
  //   Napster.init({ consumerKey: 'APIKey', isHTML5Compatible: true });
  //
  //   Napster.player.on('ready', async (e) => {
  //     // Uncomment to know when The Napster Player is ready
  //     console.log('initialized');
  //
  //     if (accessToken) {
  //       Napster.member.set({accessToken, refreshToken});
  //     }
  //   })
  //
  //   Napster.member.set({ accessToken, refreshToken  });
  // }

  compontentDidMount(){
    const detail_URL = new URL(window.location);
    const currentURL = detail_URL.href;
    const APIKey = process.env.REACT_APP_API_KEY;
    const SecretKey = process.env.REACT_APP_SECRET_KEY;

    if(detail_URL.search === ''){
      window.location = `https://api.napster.com/oauth/authorize?client_id=${APIKey}&redirect_uri=${currentURL}&response_type=code`;
    } else if (detail_URL.search.includes('code')){

      Napster.init({ consumerKey: APIKey, isHTML5Compatible: true });

      let params = new URL(window.location).searchParams;
      const code = params.get('code');

      fetch(`https://api.napster.com/oauth/access_token?client_id=${APIKey}&client_secret=${SecretKey}&response_type=code&grant_type=authorization_code&redirect_uri=${currentURL}&code=${code}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(result => {
          return result.json();
        })
        .then(result => {

          Napster.player.on('ready', function(e) {
            Napster.member.set({
              accessToken: result.access_token,
              refreshToken: result.refresh_token
            });
          });

          this.setState({
            accessToken: result.access_token,
            refreshToken: result.refresh_token
          });
        })
      }
  }

// imageClick(genre){
    //generate the tracklist for the genre clicked
//}


  render(){
    return (
      <div>
        <header className="welcome-box"></header>
        <header className="welcome">Welcome!</header>
        <header className="welcome-vector"></header>
        <h1 className="welcome-message">Enjoy the current top hits from any genre!</h1>
        <button className="pop-button"></button>
        <button className="alt-button"></button>
        <button className="country-button"></button>
        <button className="rock-button"></button>
        <button className="top-button"></button>
        <button className="hip-hop-button"></button>
        <button className="classical-button"></button>
        <button className="kids-button"></button>
        <button className="edm-button"></button>

      </div>
    );
  }
}
