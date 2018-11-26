function Html5Player () {
  this.streamingPlayer = undefined;
  this.queued = [];
  this.played = [];
  this.repeat = false;
  this.frameReady = false;
  this.ready = false;
  return this;
};

Html5Player.prototype.auth = function auth() {
  var that = this;
  this.streamingPlayer = new DrmStreamingPlayer({
    id: 'napster-streaming-player',
    apikey: API_KEY,
    token: Napster.member.accessToken,
    enableLogging: true,
    bitrate: 192,
    downgrade: true,
    currentUser: {},
    env: 'production'
  });
  this.streamingPlayer.callbackHandler('trackEnded', function() {
    window.parent.postMessage({ type: 'playevent', data: { id: that.currentTrack, code: 'PlayComplete', playing: false } }, "*")
    if (that.repeat === false){
      that.next();
    } else {
      that.streamingPlayer.play(that.currentTrack, 'UNKNOWN');
    }
  });
};

Html5Player.prototype.play = function play(o){
  this.streamingPlayer.play(o, { context: 'UNKNOWN'});
  this.played.push(o)
  window.parent.postMessage({ type: 'playevent', data: { id: o, code: 'PlayStarted', playing: true } }, "*")
};
Html5Player.prototype.pause = function pause() {
  this.streamingPlayer.pause();
  window.parent.postMessage({ type: 'playevent', data: { id: this.currentTrack, code: 'Paused', playing: false } }, "*")
};

Html5Player.prototype.resume = function resume() {
  this.streamingPlayer.resume(this.currentTrack, { context: 'UNKNOWN'});
  window.parent.postMessage({ type: 'playevent', data: { id: this.currentTrack, code: 'PlayStarted', playing: true } }, "*")
};

Html5Player.prototype.next = function next() {
  if (this.queued.length >= 1) {
    // only do something if there are songs left in the queue
    this.play(this.queued.pop());
  }
};
Html5Player.prototype.previous = function previous() {
    if (this.played.length === 1) {
      // when there are no songs left, the previous button will just restart the current track, and not do queue manipulation.
      this.streamingPlayer.play(this.played[0], { context: 'UNKNOWN'});
      window.parent.postMessage({ type: 'playevent', data: { id: this.played[0], code: 'PlayStarted', playing: true } }, "*");
    } else {
      this.queued.push(this.played.pop());
      this.play(this.played.pop());
    }
  };
Html5Player.prototype.queue = function queue(o) {
  this.queued.push(o);
};
Html5Player.prototype.clearQueue = function clearQueue() {
  this.queued = [];
  this.played = [];
};
Html5Player.prototype.toggleShuffle = function toggleShuffle() {
  this.queued = this.queued.map(function (a) {
    return [Math.random(), a];
  }).sort(function (a, b) {
    return a[0] - b[0];
  }).map(function (a) {
    return a[1];
  });
};
Html5Player.prototype.toggleRepeat = function toggleRepeat() {
  this.repeat = this.repeat === false ? true : false;
};
Html5Player.prototype.showQueue = function showQueue() {
  return this.queued;
};
Html5Player.prototype.showPlayed = function showPlayed() {
  return this.played;
};
Html5Player.prototype.seek = function seek(t){
  this.streamingPlayer.seek(this.currentTrack, t);
};
Html5Player.prototype.setVolume = function setVolume(n){
  this.streamingPlayer.setVolume(n);
};

Html5Player.prototype.fire = function fire(eventName){
  window.parent.postMessage({ type: eventName }, "*");
}

Html5Player.prototype.on = function on(eventName, callback){
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
            playing = (c === 'PlayStarted' || (c !== 'PlayComplete' && c !== 'Paused')),
            paused = (c === 'Paused');
        p.playing = m.data.data.playing = playing;
        p.paused = m.data.data.paused = paused;
        p.currentTrack = (p.playing || p.paused) ? m.data.data.id : null;
      }
      callback.call(this, m.data);
    }
  });
  return this;
};
