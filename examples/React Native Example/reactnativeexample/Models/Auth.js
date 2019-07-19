const apiKey = process.env.REACT_APP_API_KEY;
const apiSecret = process.env.REACT_APP_SECRET_KEY;
const encodedCreds = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

function Auth(){

}

Auth.authenticate = function authenticate(spec) {
  const { username, password } = spec;
  const options = {
    method: 'POST',
    uri: `${napi}/oauth/token`,
    json: true,
    resolveWithFullResponse: true,
    headers: {
      Authorization: `Basic ${encodedCreds}`
    },
    body: {
      username,
      password,
      grant_type: 'password'
    }
  };
  return rp(options);
};

module.exports = Auth;
