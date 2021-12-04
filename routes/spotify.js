var express = require('express');
var axios = require('axios').default;
require('dotenv').config()
var router = express.Router();

const spotify_my_client_id = process.env.SPOTIFY_MY_CLIENT_ID
const spotify_my_client_secret = process.env.SPOTIFY_MY_CLIENT_SECRET
const google_api_key = process.env.GOOGLE_API_KEY
// TODO: setup router in react client and change the redirect to the correct one
// const redirect_url = '/spotifymanager'
var access_token;
const redirect_uri = "http://127.0.0.1:3000/spotifymanager";
// const redirect_uri = "http://localhost:3000/spotifymanager"
// const redirect_uri = "http://127.0.0.1:3000"
router.get("/access/:code", async function(req, res) {
    const code = req.params.code;

    const url = `https://accounts.spotify.com/api/token`
    // const authorizationString = Buffer.from(`${spotify_my_client}`)

   const headers = {
    headers: {

      "Content-Type": "application/x-www-form-urlencoded",
    }

  };
  let data = {

      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirect_uri,
      client_id: spotify_my_client_id,
      client_secret: spotify_my_client_secret
  }
  const authRes = axios
    .post(
      url,
      // querystring.stringify(data),
      (new URLSearchParams(data)).toString(),
      headers
    )
    .then(response => {
      // console.log("STATUSCODE:", res.status)
      access_token = response.data.access_token;
      res.send("success")
      // console.log("RESPONSE", res.data.access_token)
    })
    .catch(error => {
      console.error(error)

    })
})
// router.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
//   next();
// });
router.get('/', function (req, res) {
    res.status(200).send("fuck you, sincerily Spotify");
})
router.get('/posts', function(req, res) {
  res.send([
    {
      id: 0,
      title: 'Lorem ipsum',
      content: 'Dolor sit amet',
      author: 'Marcin'
    },
    {
      id: 1,
      title: 'Vestibulum cursus',
      content: 'Dante ut sapien mattis',
      author: 'Marcin'
    }
  ]);
});
router.get('/user', async function(req, res) {
  // const user_id = req.params.id;
  // TODO: it wont work without auth token or something, 
  console.log(access_token)
  let data;
  if(access_token){
    // const data = {
    //   grant_type: "authorization_code",

    // }
    const headers = {
      
      headers: {
        "Authorization": `Bearer ${access_token}`,
      }
    }
    const url = `https://api.spotify.com/v1/me`
    const fetchRes = axios
      .get(
        url,
        headers
        )
      .then(response => {
        data = response.data;
        // console.log(data)
        res.send(data)
      })
      .catch(error => {
        console.error(error)
      })
    // const fetchRes = await fetch(url, {headers: `Authorization: Bearer ${access_token}`})
    // const data = await fetchRes.json()
    // console.log(data)
    // res.send(data)
  }
})
router.get("/playlists", async function(req, res) {
  // const user_id = req.params.id;
  // const url = `https://api.spotify.com/v1/users/${my_client_id}/playlists`
  const url = `https://api.spotify.com/v1/me/playlists`
  let data;
  const headers = {
    headers: {
      "Authorization": `Bearer ${access_token}`,
    }
  }
  const params = new URLSearchParams([['limit', 50]]);
  const fetchRes = axios
    .get(
      url,
      headers,
      {params}
    )
    .then(response => {
      data = response.data;
      res.send(data)
    })
    .catch(error => {
      console.error(error)
    })
  // const fetchRes = await fetch(url)
  // const data = await fetchRes.json()
  // console.log(data)

})
router.get('/playlist/:id', async function(req, res) {
  
  const playlist_id = req.params.id;
  const url = `https://api.spotify.com/v1/playlists/${playlist_id}`
  let data;
  const headers = {
    headers: {
      "Authorization": `Bearer ${access_token}`
    }
  }
  const fetchRes = axios
    .get(
      url,
      headers
    )
    .then(response => {
      data = response.data
      res.send(data)
    })
    .catch(error => {
      console.error(error)
    })
})
router.get('/login', function(req, res) {
    var scopes = 'user-read-private playlist-modify-private playlist-read-private user-read-email';
    var redirect_url = 'https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + spotify_my_client_id +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(redirect_uri);
    // var redirect_url = 'https://accounts.spotify.com/authorize' +
    // '?response_type=code' +
    // '&client_id=' + my_client_id +
    // (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    // '&redirect_uri=' + redirect_uri;
    // res.set('Content-Type', 'text/html');
    const res_obj = [{
      url: redirect_url
    }]
    // res.send(
    //   res_obj
    // )
    res.json(res_obj)
    // res.send(redirect_url)

})

module.exports = router;