const express = require("express")
const yts = require("yt-search")
const axios = require("axios").default;
require("dotenv").config()
const router = express.Router();
const youtube_my_client_id = process.env.YOUTUBE_MY_CLIENT_ID;
const redirect_uri = "http://127.0.0.1:3000/"

router.get("/:accesstoken/createplaylist/:title", async function(req, res) {
    const title = req.params.title
    const access_token = req.params.accesstoken
    const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet%2Cstatus`
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

    )
    .then(response => {
        res.json([
            {
                ok: "true",
                etag: response.data.etag,
                id: response.data.id
            }
        ])
    })
    .catch(error => {
        console.log(error)
        res.status(502).json(
            [{
                ok: "false",
                message: "Could not perform the action because the daily google api quota has been exceeded"
            }]
        )
    })
})

router.get("/login/:redirecttarget", async function(req, res) {
    const redirectTarget = req.params.redirecttarget
    
    const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
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
})

router.get("/:accesstoken/addtoplaylist/:playlistid/:itemid/:position", async function(req, res){
    const url = "https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet"
    const playlistId = req.params.playlistid
    const itemId = req.params.itemid
    const position = req.params.position
    const access_token = req.params.accesstoken
    const data = {
        snippet: {
            "playlistId": playlistId,
            "resourceId": {
                "videoId": itemId,
                "kind": "youtube#video"
            },
            "position": parseInt(position)
        }
    }
    const headers = {
        headers: {
            "Authorization": "Bearer " + access_token,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }

    axios
    .post(
        url,
        data,
        headers
    )
    .then(response => {
        res.send()
    })
    .catch(error => {
        res.status(502).send()
    })

})

router.get("/search/:query", async function(req, res){
    const query = req.params.query
    const r = await yts(query)
    const videos = r.videos
    res.json([{
        result: videos[0].videoId
    }])
})

module.exports = router