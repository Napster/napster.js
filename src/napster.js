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

  //= require 'flash_player.js'
  //= require 'html5_player.js'

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
      REFRESH_TOKEN_KEY = 'napster.member.refreshToken',
      streamingPlayer,
      player,
      API_KEY;

  var Member = function(obj) {
    for (var k in obj) {
      this[k] = obj[k];
    }
  };

  var Library = function(member) {
    this.member = member;
  };

  function isFlash () {
    return player === 'FLASH_PLAYER';
  };

  var Napster = {
    // ### Initialization Options
    // Set your developer key and application ID here.  You can also (optionally) specify which API and catalog versions you prefer.
    //
    //     Napster.init({
    //       consumerKey: options.consumerKey,
    //       version: 'v1',
    //       catalog: 'EN',
    //       isHTML5Compatible: true
    //     });

    init: function(options) {
      this.api.consumerKey = options.consumerKey;
      API_KEY = options.consumerKey;
      this.api.version = options.version || this.api.version;
      this.api.catalog = options.catalog || this.api.catalog;

      function shouldLoadHTML5Engine() {
        // Browser detection goes here. Override detection by setting the playback engine option.

        if (options.isHTML5Compatible === true) {
          return true;
        }

        // TODO: Detect browser

        // Logic should be written as follows. If in IE, return false
        // If mobile, chrome, firefox, safari, return true
      }
      function checkRequirements() {
        if (!navigator.cookieEnabled) {
          return false;
        }
        try {
          if (typeof localStorage === 'undefined') {
            return false;
          }
        } catch(error) {
          return false;
        }
        return true;
      }

      var id = options.player || 'player-frame';

      if (id && typeof id === 'string') {
        var that = this, d = $('#' + id);

        if (shouldLoadHTML5Engine()) {
          //Load HTML5 playback engine
          player = 'HTML5_PLAYER';

          if (!checkRequirements()) {
            throw new Error('Cookies or localStorage is not enabled. Napster.js will not work properly without it.')
          }

          that.player = new Html5Player();
          $("<video-js id='napster-streaming-player' class='video-js' playsinline></video-js>").appendTo($(document.body));
          $("#napster-streaming-player").css("display","none");
          $.ajax({
            url: 'https://api.napster.com/v2/streaming-player.js',
            dataType: 'script',
            async: true,
            success: function () {
              Napster.player.fire('ready');
            }
          });
        } else {
          //Fallback to flash
          player = 'FLASH_PLAYER';
          that.player = new FlashPlayer();
          if (d.length === 0) {
            $(function() {
              var f = $('<iframe></iframe>')
                .attr('id', id)
                .attr('name', id)
                .attr('src', 'http://api.napster.com/v1.1/player/index.html?apikey=' + options.consumerKey)
                .attr('frameborder', 'no')
                .attr('style', 'display:none;')
                .appendTo($(document.body))
                .load(function() {
                  that.player.win = f.get(0);
                });
            });
          }
          else if (d.get(0) instanceof HTMLIFrameElement) {
            that.player.win = d.get(0);
          }
          else {
            throw new Error('The element "' + id + '" is not an HTMLIFrameElement.')
          }
        }
      }
    }
  }

    Napster.api = {
      host: 'api.napster.com',
      catalog: 'US',
      version: 'v2.2',
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
    };

    Napster.member = new function() {
      var m = {};
      try {
        m = new Member({
          accessToken: exports.localStorage[ACCESS_TOKEN_KEY],
          refreshToken: exports.localStorage[REFRESH_TOKEN_KEY]
        });
      } catch(error) {
        throw new Error('Cookies or localStorage is not enabled. Napster.js will not work properly without it.');
      }
      return m;
    };
    Napster.previewer = {
      play: function() {
        return this;
      },
      pause: function() {
        return this;
      }
    };
    Napster.windows = function(win) {
      return {
        post: function(method, args) {
          if (!win) {
            throw new Error('An iframe was not found at that reference.');
          }
          win.contentWindow.postMessage({ method: method, args: Napster.util.jsonClean(args || {}) }, "*");
        }
      }
    };
    Napster.on = function(eventName, callback) {
      window.addEventListener(eventName, callback);
    };
    Napster.util = {
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
    };
  // };

  method(Member.prototype, 'set', function(creds) {
    if (creds && creds.accessToken && creds.refreshToken) {
      this.accessToken = exports.localStorage[ACCESS_TOKEN_KEY] = creds.accessToken;
      this.refreshToken = exports.localStorage[REFRESH_TOKEN_KEY] = creds.refreshToken;
      Napster.player.auth(creds.accessToken);
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
  // Napster.player
  //   .on('playevent', function(e) {  })
  //   .on('playtimer', function(e) {  })

  exports.Napster = Napster;
  exports.Member = Member;

})(window, jQuery, JSON);
