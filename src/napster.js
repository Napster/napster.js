//  Copyright (c) 2017 Napster / Rhapsody International
//  Code released under the MIT license.
//  See https://github.com/Napster/napster.js#the-mit-license-mit for more detail.
//  The first thing you need to do, after including Napster.js in your app (but before using it), is initialize the Napster object with your application key.
//
//     Napster.init({
//       consumerKey: 'foo'
//     });
//

(function(exports, $, JSON) {

  'use strict';

  if (!exports || !$ || !$.ajax || !JSON) return;

  var stringify = JSON.stringify;
  JSON.stringify = function(o) {
    return stringify(o, function(k, v) {
      if (k === 'genre') {
        return {
          id: v.id,
          name: v.name
        };
      }
      return v;
    });
  };

  var method = function(o, fname, f) {
    var old = o[fname];
    o[fname] = function() {
      if (f.length === arguments.length) {
        return f.apply(this, arguments); // o -> this
      }
      else if (typeof old === 'function') {
        return old.apply(this, arguments);
      }
    };
  };

  var ACCESS_TOKEN_KEY = 'napster.member.accessToken',
      REFRESH_TOKEN_KEY = 'napster.member.refreshToken';

  var Member = function(obj) {
    for (var k in obj) {
      this[k] = obj[k];
    }
  };

  var Library = function(member) {
    this.member = member;
  };

  var Napster = {

    // ### Initialization Options
    // Set your developer key and application ID here.  You can also (optionally) specify which API and catalog versions you prefer.
    //
    //     Napster.init({
    //       consumerKey: options.consumerKey,
    //       version: 'v1',
    //       catalog: 'EN'
    //     });

    init: function(options) {
      this.api.consumerKey = options.consumerKey;
      this.api.version = options.version || this.api.version;
      this.api.catalog = options.catalog || this.api.catalog;

      var id = options.player || 'player-frame';

      if (id && typeof id === 'string') {
        var that = this, d = $('#' + id);

        if (d.length === 0) {
          $('<iframe></iframe>')
            .attr('id', id)
            .attr('name', id)
            .attr('src', 'http://api.napster.com/v1.1/player/index.html?apikey=' + options.consumerKey)
            .attr('frameborder', 'no')
            .attr('style', 'height:0;width:0;')
            .appendTo($(document.body))
            .get(0)
            .addEventListener('load', function() {
              that.player.win = this;
            });
        }
        else if (d.get(0) instanceof HTMLIFrameElement) {
          that.player.win = d.get(0);
        }
        else {
          throw new Error('The element "' + id + '" is not an HTMLIFrameElement.')
        }
      }
    },

    api: {
      host: 'api.napster.com',
      catalog: 'US',
      version: 'v2.1',
      endpoint: function(secure) {
        return (secure ? 'https://' : 'http://') + [this.host, this.version].join('/');
      },
      headers: function(secure) {
        var h = {};

        if (secure && Napster.member.accessToken) {
          h['Authorization'] = 'Bearer ' + Napster.member.accessToken;
        }

        return h;
      },
      dataType: function() {
        return 'json';
      },

      get: function(secure, path, cb) {

        var data = { apikey: this.consumerKey };

        $.ajax({
          type: 'GET',
          dataType: this.dataType(),
          data: data,
          headers: this.headers(secure),
          url: this.endpoint(secure) + path,
          success: function(data, textStatus, jqXHR) {
            cb(data);
          },
          error: function(jqXHR) {
            cb({ status: jqXHR.status, error: jqXHR.statusText, response: jqXHR.responseJSON });
          }
        });
      },

      post: function(secure, path, data, cb) {

        if (!data) data = {};

        $.ajax({
          type: data._method || 'POST',
          data: data,
          dataType: this.dataType(),
          headers: this.headers(secure),
          url: this.endpoint(secure) + path + (secure ? '' : '?apikey=' + this.consumerKey),
          success: function(data, textStatus, jqXHR) {
            cb(data);
          },
          error: function(jqXHR) {
            cb({ status: jqXHR.status, error: jqXHR.statusText, response: jqXHR.responseJSON });
          }
        });
      },

      put: function(secure, path, data, cb) {
        data._method = 'PUT';
        this.post.call(this, secure, path, data, cb);
      },

      del: function(secure, path, data, cb) {
        data._method = 'DELETE';
        this.post.call(this, secure, path, data, cb);
      }
    },

    member: new function() {
      var m = new Member({
        accessToken: exports.localStorage[ACCESS_TOKEN_KEY],
        refreshToken: exports.localStorage[REFRESH_TOKEN_KEY]
      });

      return m;
    },

    // ### Playback
    // The Napster object exposes a top-level ``player`` object that gives you just about everything you need to manage playback.

    player: {
      frameReady: false,
      ready: false,

      auth: function() {
        if (Napster.api.consumerKey && Napster.member.accessToken) {
          Napster.windows(this.win).post('auth', { consumerKey: Napster.api.consumerKey, accessToken: Napster.member.accessToken  });
        }
      },

      // #### Playing a Track
      // You can play a track ID or Track object.  (Track objects are detailed below.)
      //
      //     Napster.player.play('Tra.5156528');
      //
      // or
      //
      //     Track.find('Tra.5156528', function(t) {
      //       Napster.player.play(t);
      //     });

      play: function(o) {
        Napster.previewer.pause();
        Napster.windows(this.win).post('play', o);
        return this;
      },

      // #### Pausing
      //
      //     Napster.player.pause();

      pause: function() {
        Napster.windows(this.win).post('pause');
        return this;
      },

      // #### Skipping to the Next Track
      //
      //     Napster.player.next();

      next: function() {
        Napster.windows(this.win).post('playNext');
      },

      // #### Skipping to the Previous Track
      //
      //     Napster.player.previous();

      previous: function() {
        Napster.windows(this.win).post('playPrevious');
      },

      // #### Queueing a Track
      //
      //     Napster.player.queue('Tra.5156528');

      queue: function(o) {
        Napster.windows(this.win).post('queue', o);
        return this;
      },

      // #### Clear the Queue
      //
      //     Napster.player.clearQueue();

      clearQueue: function() {
        Napster.windows(this.win).post('clearQueue');
      },

      // #### Shuffle
      //
      //     Napster.player.toggleShuffle();
      //

      toggleShuffle: function() {
        Napster.windows(this.win).post('toggleShuffle');
      },

      // #### Repeat
      //
      //     Napster.player.toggleRepeat();

      toggleRepeat: function() {
        Napster.windows(this.win).post('toggleRepeat');
      },

      // #### Seek
      // For example, to seek to 0:10 in a given track:
      //
      //     Napster.player.seek(10);

      seek: function(t) {
        Napster.windows(this.win).post('seek', t);
      },

      // #### Set volume
      // Volume should be in range [0,1]
      //
      //     Napster.player.setVolume(0.8);

      setVolume: function(n) {
        Napster.windows(this.win).post('setVolume', n);
      },

      // ### Playback Events
      // There are a number of interesting playback-related events you can listen for:
      //
      //   * playevent: Starts, pauses, completes, etc.
      //   * playtimer: Current time, total time, waveform data
      //   * error: Bad things
      //
      // Listening for player events is simple:
      //
      //     Napster.player.on('playevent', function(e) {
      //       console.log(e.data);
      //     });
      //
      //     Napster.player.on('playtimer', function(e) {
      //       console.log(e.data);
      //     });
      //
      //     Napster.player.on('error', function(e) {
      //       console.log(e.data);
      //     });

      on: function(eventName, callback) {
        var p = this;

        window.addEventListener('message', function(m) {

          if (m.data.type === 'playerframeready') {
            p.frameReady = true;
          }
          else if (m.data.type === 'ready') {
            p.ready = true;
          }
          else if (m.data.type === 'playsessionexpired') {
            p.paused = false;
            p.playing = false;
          }

          if (p.frameReady && p.ready && !p.authed) {
            p.authed = true;
            p.auth();
          }

          if (m.data.type === eventName) {
            if (m.data.data && m.data.data.id) {
              m.data.data.id = m.data.data.id.replace('tra', 'Tra');

              var c = m.data.data.code,
                  playing = (c === 'PlayStarted' || (c !== 'PlayComplete' && c !== 'Paused' && c !== 'BufferEmpty' && c !== 'NetworkDropped' && c !== 'PlayInterrupted' && c !== 'IdleTimeout')),
                  paused = (c === 'Paused' || c === 'NetworkDropped' || c === 'PlayInterrupted' || c === 'IdleTimeout');

              p.playing = m.data.data.playing = playing;
              p.paused = m.data.data.paused = paused;
              p.currentTrack = (p.playing || p.paused) ? m.data.data.id : null;
            }

            callback.call(this, m.data);
          }
        });

        return this;
      }
    },
    previewer: {
      play: function() {
        return this;
      },
      pause: function() {
        return this;
      }
    },
    windows: function(win) {
      return {
        post: function(method, args) {
          if (!win) {
            throw new Error('An iframe was not found at that reference.');
            return;
          }
          win.contentWindow.postMessage({ method: method, args: Napster.util.jsonClean(args || {}) }, "*");
        }
      }
    },
    on: function(eventName, callback) {
      window.addEventListener(eventName, callback);
    },
    util: {
      secondsToTime: function(s) {
        if (!isNaN(s)) {
          var minutes = Math.floor(s / 60);
          var seconds = Math.floor(s) % 60;
          return minutes + ':' + ((seconds < 10) ? '0' + seconds : seconds);
        }
        return '0:00';
      },
      jsonClean: function(o) {
        return JSON.parse(JSON.stringify(o, function(k, v) {
          if (k === 'genre') return { id: v.id, name: v.name };
          return v;
        }));
      }
    }
  };

  method(Member.prototype, 'set', function(creds) {
    if (creds && creds.accessToken && creds.refreshToken) {
      this.accessToken = exports.localStorage[ACCESS_TOKEN_KEY] = creds.accessToken;
      this.refreshToken = exports.localStorage[REFRESH_TOKEN_KEY] = creds.refreshToken;

      Napster.player.auth();
    }
  });

  method(Member.prototype, 'unset', function() {
    this.accessToken = this.refreshToken = null;

    exports.localStorage.removeItem(ACCESS_TOKEN_KEY);
    exports.localStorage.removeItem(REFRESH_TOKEN_KEY);
  });

  method(Member.prototype, 'load', function() {
    this.accessToken = exports.localStorage[ACCESS_TOKEN_KEY];
    this.refreshToken = exports.localStorage[REFRESH_TOKEN_KEY];

    return this;
  });

  method(Member.prototype, 'signedIn', function() {
    return (this.accessToken != null && this.refreshToken != null);
  });

  // Everyone listens to these events
  Napster.player
    .on('playevent', function(e) {  })
    .on('playtimer', function(e) {  });

  exports.Napster = Napster;
  exports.Member = Member;

})(window, jQuery, JSON);
