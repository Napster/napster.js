# napster.js

## Getting Started
This SDK has been deprecated in favor of the new and improved [napster.js](https://github.com/Napster/napster.js) SDK. This SDK is now for internal use only and should be merged into the public repo for any changes to be made public.


```javascript
Napster.init({
  consumerKey: 'foo'
});
```

### Initialization Options
| Attribute      | Default        | Description   |
| -------------- | -------------- | ------------- |
| consumerKey    | undefined      | The application key |
| version        | 'v2.2'           | API endpoint version. Please refer to [developer.napster.com](developer.napster.com) for available versions. |
| catalog        | 'EN'           | The desired catalog locale |
| player         | 'player-frame' | The html element id where the player iframe will be embedded |

### Authentication
The Member object exposes a methods for user sessions. Use the `Napster.member.set(credentials)` to manage sessions. After setting the member session information the player will automatically be reauthenticated.

```javascript
Napster.member.set({
  accessToken: 'oauth access token',
  refreshToken: 'oauth refresh token'
});
```

### Playback
The Napster object exposes a top-level `player` object that provides the necessary methods to manage playback.

#### Check if player is ready and authorize

```javascript
Napster.player.on('ready', function(e) {
    Napster.member.set({accessToken: 'oauth access token'}); // If not set earlier
    Napster.player.auth();
}
```

#### Playing a track
```javascript
Napster.player.play('Tra.5156528');
```

#### Pausing
```javascript
Napster.player.pause();
```

#### Seek
For example, to seek to 0:10 in a given track:

```javascript
Napster.player.seek();
```

#### Volume

Set volume between muted (0) and max (1.0)

```javascript
Napster.player.setVolume(.5);
```

### Data
The Napster object exposes some API convenience methods. There are methods for HTTP GET, POST, PUT, and DELETE. The first parameter determines if a secure request is made.

```javascript
Napster.api.get(false, '/tracks/top', function(data) {
  Napster.player.play(data.tracks[0].id);
});
```

### Events
There are a number of interesting playback-related events you can listen for:

* playevent: Starts, pauses, completes, etc.
* playtimer: Current time, total time, waveform data
* error: Bad things
* metadata
* ready
* playsessionexpired
* playstopped

Listening for player events is simple:

```javascript
Napster.player.on('playevent', function(e) {
  console.log(e.data);
});

Napster.player.on('playtimer', function(e) {
  console.log(e.data);
});

Napster.player.on('error', function(e) {
  console.log(e.data);
});
```



## Contributing
[Bug reports](https://github.com/Napster/napster.js/issues) and [pull requests](https://github.com/Napster/napster.js/pulls) are welcome on GitHub.

If you'd like to contribute to the development of this SDK:

+ Fork the repo
+ Make your changes in `src/napster.js`
+ Test thoroughly and ensure the [Example App](https://github.com/Napster/napster.js/tree/master/example) functions properly with your changes.
+ Submit a pull request.

## License

This SDK is released under the MID License:

The MIT License (MIT)
---------------------------------

*Copyright &copy; 2018 Napster / Rhapsody International*

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
