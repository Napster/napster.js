function FlashPlayer () {
  this.frameReady = false;
  this.ready = false;
};

FlashPlayer.prototype.auth = function auth() {
  if (Napster.api.consumerKey && Napster.member.accessToken) {
    Napster.windows(this.win).post('auth', { consumerKey: Napster.api.consumerKey, accessToken: Napster.member.accessToken  });
  }
};

FlashPlayer.prototype.play = function play(o){
  Napster.previewer.pause();
  Napster.windows(this.win).post('play', o);
  return this;
};

FlashPlayer.prototype.pause = function pause() {
  Napster.windows(this.win).post('pause');
  return this;
};

FlashPlayer.prototype.resume = function resume() {
  //TODO: figure out how flash does this/ if it is needed, etc.
};
FlashPlayer.prototype.next = function next() {
  Napster.windows(this.win).post('playNext');
};

FlashPlayer.prototype.previous = function previous() {
  Napster.windows(this.win).post('playPrevious');
};

FlashPlayer.prototype.queue = function queue() {
  Napster.windows(this.win).post('queue', o);
  return this;
};

FlashPlayer.prototype.clearQueue = function clearQueue() {
  Napster.windows(this.win).post('clearQueue');
};

FlashPlayer.prototype.toggleShuffle = function toggleShuffle() {
  Napster.windows(this.win).post('toggleShuffle');
};

FlashPlayer.prototype.toggleClass = function toggleClass() {
  Napster.windows(this.win).post('toggleRepeat');
};

FlashPlayer.prototype.seek = function seek() {
  Napster.windows(this.win).post('seek', t);
};

FlashPlayer.prototype.setVolume = function setVolume() {
  Napster.windows(this.win).post('setVolume', n);
};

FlashPlayer.prototype.fire = function fire(eventName){
  window.parent.postMessage({ type: eventName }, "*");
}

FlashPlayer.prototype.on = function on(eventName, callback){
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
};
