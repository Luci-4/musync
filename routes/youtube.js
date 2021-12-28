var express = require("express")
var axios = require("axios").default;
require("dotenv").config()
var router = express.Router();
const youtube_my_client_id = process.env.YOUTUBE_MY_CLIENT_ID;
const redirect_uri = "http://127.0.0.1:3000/"
var access_token = undefined;
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
router.get("/createplaylist/:title", async function(req, res) {
    const title = req.params.title
    const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet%2Cstatus`
    console.log("creating playlist", access_token)
    const data = {
        snippet: {
            
            "title": title
        },
        status: {
            "privacyStatus": "private"
        }
    }
    const headers = {
        headers: {
            "Authorization": `Bearer ` + access_token,
            "Content-Type": 'application/json',
            "Accept": "application/json"

        }
    }
    
    axios
    .post(
        url,
        data,
        headers
        // (new URLSearchParams(data)).toString()

    )
    .then(response => {

        res.json([
            {
                etag: response.data.etag,
                id: response.data.id

            }
        ])
        // res.send("success")
    })
    .catch(error => {
        console.log("fucked")
        console.log(Object.keys(error))
        console.log(error.response)
        // console.log(error.config.data)
    })
})
router.get("/access/:token", async function(req, res) {
    console.log(access_token)
    access_token = req.params.token
    console.log("created", access_token)
    res.send("success")
})
router.get("/login/:redirecttarget", async function(req, res) {
    const redirectTarget = req.params.redirecttarget
    
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
    `&redirect_uri=${encodeURIComponent(redirect_uri + redirectTarget)}` + 
    `&scope=${encodeURIComponent(scope)}` + 
    `&response_type=token` + 
    `&include_granted_scopes=false`
    const res_obj = [{
        url: redirect_url
    }]
    res.json(res_obj)
// router.get("access:code")

// router.get("search/:query" async function(req, res){
//     const url = "";
//     const headers = {
//         headers: {
//             Authorization: `Bearer${youtube}`
//         }
//     }
//     const params = {
        
//     }
// })
// router.get("/create/:title", async function(req, res){
//     const url = "https://www.googleapis.com/youtube/v3/playlists"
//     const title = req.params.title
//     console.log(title)
//     const data = {
//         "title": title,
//     }
//     res.send("success")
//     // axios
//     // .post(
//     //     url,
//     //     (new URLSearchParams(data)).toString()
//     // )
//     // .then(response => {
//     //     console.log(response)
//     //     res.send("success")
//     // })
//     // .catch(error => {
//     //     console.error(error)
//     // })
// })
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