const TrackCalls = {};

TrackCalls.getTracks = function getTracks(access_token, genre) {
  const url = `https://api.napster.com/v2.2/genres/${genre}/tracks/top?limit=20&isStreamableOnly=true`;
  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  })
    .then(result => result.json())
    .then(result => result.tracks.slice(0, 10))
    .catch(err => Error(err, "Loading Tracks"));
};


export default TrackCalls;
