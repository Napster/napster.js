const GenreCalls = {};

GenreCalls.getGenres = function getGenres(access_token) {
  const url = "https://api.napster.com/v2.2/genres?lang=en_US";
  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  })
    .then(result => result.json())
    .then(result => result.genres)
    .catch(err => Error(err, "Loading Genres"));
};


export default GenreCalls;
