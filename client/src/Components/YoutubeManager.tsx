import React, { useEffect, useState } from 'react';
import { playlistsMarks } from './SpotifyManager';
import './YoutubeManager.css'

const fetchRequest = async (url: String) => {
    let res = await fetch(`http://localhost:3000/spotify/${url}`)
    console.log(res)
    let data = await res.text()
    console.log(data)
    return data
}
const auth = () => {
    console.log("authenticating...")
    const res = fetchRequest("accesss")
    return res
}


export default function YoutubeManager() {
    return (
        <div id="YoutubeManager" className="noselect">
            {/* <ul id="playlists">
                {
                    playlistsMarks
                }
            </ul> */}
            hello
        </div>
    )
}