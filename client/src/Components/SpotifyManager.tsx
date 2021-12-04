import React, { useEffect, useState } from 'react';
import Playlist, {PlaylistObj} from './Playlist';
import './SpotifyManager.css'

// export type Origin = 'YouTube' | 'Spotify';

const getCode = () => {
    // const code = getJsonFromUrl(window.location.href)
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code')
    return code
}

const fetchRequest = async (url: String) => {
    let res = await fetch(`http://localhost:3000/spotify/${url}`)
    console.log(res)
    let data = await res.text()
    console.log(data)
    return data
}
const fetchRequestJson = async (url: String) => {
    let res = await fetch(`http://localhost:3000/spotify/${url}`)
    console.log(res)
    let data = await res.json()
    console.log(data)
    return data
}
const auth = () => {
    console.log("authenticating...")
    const code = getCode()
    const res = fetchRequest(`access/${code}`)

    return res
}
const goNext = () => {
    console.log("hello")
}
export default function SpotifyManager(){
    const [playlists, setPlaylists]: [Array<PlaylistObj>, Function] = useState([])
    const [playlistsElems, setPlaylistsElems]: [Array<object>, Function] = useState([])
    useEffect(() => {
        const initManager = async () => {
            const getPlaylists = async () => {
                
                const playlistsTest = []
                const userData = await fetchRequestJson(`playlists`)
                let itemIndex = 0;
                for (let item of userData.items){
                    let itemObj: PlaylistObj = {
                        key: itemIndex,
                        name: item.name,
                        id: item.id,
                        href: item.tracks.href,
                        images: item.images
                    }
                    itemIndex++;

                    // playlistsElems.push(<Playlist {...itemObj}/>)
                    let elem = <Playlist {...itemObj}/>;
                    playlistsTest.push(elem)
                    // setPlaylistsElems([...playlistsElems, elem])

                    setPlaylists([...playlists, itemObj])
                }
                setPlaylistsElems(playlistsTest)
            }
            try{
                await auth();
                getPlaylists()


            }catch(error){
                console.error(error)
            }
    }
    initManager()
    
}, [])

return (
    <div id="SpotifyManager" className="noselect">
            
           <ul id="playlists">
                {
                    playlistsElems 
                }
           </ul>
           <div id="button-next" onClick={e => {goNext()}}>
                <div id="next">NEXT</div>
                <div id="arrow">{">"}</div>
           </div>
        </div>
    )
}
