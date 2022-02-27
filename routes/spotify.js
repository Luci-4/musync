var express = require('express');
var axios = require('axios').default;
require('dotenv').config()
var router = express.Router();

const spotify_my_client_id = process.env.SPOTIFY_MY_CLIENT_ID
const spotify_my_client_secret = process.env.SPOTIFY_MY_CLIENT_SECRET
const google_api_key = process.env.GOOGLE_API_KEY
var access_token;
const redirect_uri = "http://127.0.0.1:3000/";

router.get("/access/:redirecttarget/:code", async function(req, res) {
    const redirectTarget = req.params.redirecttarget
    const code = req.params.code;

    const url = `https://accounts.spotify.com/api/token`

   const headers = {
    headers: {

      "Content-Type": "application/x-www-form-urlencoded",
    }

  };
  let data = {

      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirect_uri + redirectTarget,
      client_id: spotify_my_client_id,
      client_secret: spotify_my_client_secret
  }

  const authRes = axios
    .post(
      url,
      (new URLSearchParams(data)).toString(),
      headers
    )
    .then(response => {
      const access_token = response.data.access_token;
      res.send(access_token)
    })
    .catch(error => {
      console.error(error)

    })
})

router.get('/', function (req, res) {

    res.status(200).send("hello there");
})

router.get('/:accesstoken/user', async function(req, res) {
  // TODO: it wont work without auth token or something, 
  const access_token = req.params.accesstoken;
  console.log(access_token)
  let data;
  if(access_token){
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
        res.send(data)
      })
      .catch(error => {
        console.error(error)
        res.status(502).send()
      })
  }
  else {
    res.status(401).send()
  }
})

router.get("/:accesstoken/playlists", async function(req, res) {
  const url = `https://api.spotify.com/v1/me/playlists?limit=50`
  const access_token = req.params.accesstoken;
  let data;
  const headers = {
    headers: {
      "Authorization": `Bearer ${access_token}`,
    }
  }

  const fetchRes = axios
    .get(
      url,
      headers,
    )
    .then(response => {
      data = response.data;
      res.send(data)
    })
    .catch(error => {
      console.error(error)
      res.status(502).send()
    })
})

router.get('/:accesstoken/playlist/:id', async function(req, res) {
  
  const playlist_id = req.params.id;
  const access_token = req.params.accesstoken;
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
      res.status(502).send()
    })
})

router.get('/login/:redirecttarget', function(req, res) {
    const redirectTarget = req.params.redirecttarget
    var scopes = 'user-read-private playlist-modify-private playlist-read-private user-read-email';
    var redirect_url = 'https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + spotify_my_client_id +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
    '&redirect_uri=' + encodeURIComponent(redirect_uri + redirectTarget);
    const res_obj = [{
      url: redirect_url
    }]
    res.json(res_obj)
})

router.get('/:accesstoken/tracks/:id', async function(req, res) {

  const playlistID = req.params.id;
  const access_token = req.params.accesstoken;
  const url = `https://api.spotify.com/v1/playlists/${playlistID}/tracks?limit=50`
  let data;
  const headers = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  }
  const fetchRes = axios
    .get(
      url,
      headers
    )
    .then(response => {
      data = response.data;
      res.send(data)
    })
    .catch(error => {
      console.error(error)
      res.status(502).send()
    })

})

module.exports = router;