var express = require("express")
var {google} = require("googleapis")
var axios = require("axios").default;
require("dotenv").config()
var router = express.Router();
const youtube_my_client_id = process.env.YOUTUBE_MY_CLIENT_ID;
console.log(google.youtube)
const redirect_uri = "http://127.0.0.1:3000/youtubemanager"
const auth = () => {
    const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
    const params = {
        "client_id": youtube_my_client_id,
        "redirect_uri": redirect_uri,
        "response_type": "token",
        "scope": "https://www.googleapis.com/auth/youtube",
        "include_granted_scopes": "true",
        "state": "pass-through value"
    }
    const redirect_url = oauth2Endpoint + 
    `?client_id=${youtube_my_client_id}` + 
    `&redirect_uri=${encodeURIComponent(redirect_uri)}` + 
    `&scope=${encodeURIComponent(scope)}` + 
    `&response_type=token` + 
    `&include_granted_scopes=true`
    const res_obj = [{
        url: redirect_url
    }]
    res.json(res_obj)
    // var params = {'client_id': 'YOUR_CLIENT_ID',
    //             'redirect_uri': 'YOUR_REDIRECT_URI',
    //             'response_type': 'token',
    //             'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
    //             'include_granted_scopes': 'true',
    //             'state': 'pass-through value'};
}
router.get("/login", async function(req, res) {
    
    const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
    const params = {
        "client_id": youtube_my_client_id,
        "redirect_uri": redirect_uri,
        "response_type": "token",
        "scope": "https://www.googleapis.com/auth/youtube",
        "include_granted_scopes": "true",
        "state": "pass-through value"
    }
    const scope = "https://www.googleapis.com/auth/youtube"
    const redirect_url = oauth2Endpoint + 
    `?client_id=${youtube_my_client_id}` + 
    `&redirect_uri=${encodeURIComponent(redirect_uri)}` + 
    `&scope=${encodeURIComponent(scope)}` + 
    `&response_type=token` + 
    `&include_granted_scopes=true`
    const res_obj = [{
        url: redirect_url
    }]
    res.json(res_obj)



    // const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
    // const headers = {"alg":"RS256","typ":"JWT"}

    // const claims = {
    //     "iss": "761326798069-r5mljlln1rd4lrbhg75efgigp36m78j5@developer.gserviceaccount.com",
    //     "scope": "https://www.googleapis.com/auth/youtube",
    //     "aud": "https://oauth2.googleapis.com/token",
    //     "exp": 1328554385,
    //     "iat": 1328550785
    // }

    // const params = {
    //     "client_id": youtube_my_client_id,
    //     "redirect_uri": redirect_uri,
    //     "response_type": "token",
    //     "scope": "https://www.googleapis.com/auth/youtube",
    //     "include_granted_scopes": "true",
    //     "state": "pass-through value"
    // }
    // const authRes = axios
    //     .get(
    //         oauth2Endpoint,
    //         (new URLSearchParams(params)).toString()
    //     )
    //     .then(response => {
    //         // console.log(response.status)
    //         // console.log(response.statusText)
    //         // console.log(response.headers)
    //         // console.log(Object.keys(response.config))
    //         console.log(Object.keys(response.request))


    //     })
    //     .catch(error => {
    //         console.error(error)
    //     })
})

module.exports = router