import { Buffer } from 'buffer'
const apiKey = 'NjE5ODVhZmYtODFmZi00OTQwLTg0YzMtOGE5ZWYwN2E5Njhm';
const apiSecret = 'MDMwYzM2MmEtMThmZi00YmIyLWE1ZDktY2ZiZWJlMTNkZDFk';
const encodedCreds = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

const Auth = {};

Auth.authenticate = function authenticate(username, password) {
  const url = "https://api.napster.com/oauth/token";
  const spec ={
    method: 'POST',
    json: true,
    resolveWithFullResponse: true,
    headers: {
      Accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Basic ${encodedCreds}`
    },
    body: JSON.stringify({
      username,
      password,
      grant_type: 'password'
    })
  }
  return fetch(url, spec)
    .then(result => result.json())
    .then(result => {
      return result;
    })
};

export default Auth;
