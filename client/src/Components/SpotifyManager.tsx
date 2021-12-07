import React, { useEffect, useState } from 'react';
import LoadingBar from './LoadingBar';
// import LoadingBar from './LoadingBar';
import Playlist, {PlaylistObj, PlaylistObjTracks, PlaylistProps} from './Playlist';
import './SpotifyManager.css'

export var playlistsMarks: Array<boolean> = []
const initPlaylistMarks = (playlists: Array<PlaylistObj>) => {
    for(let playlist of playlists){
        playlistsMarks[playlist.key] = false
    }
}
// export type Origin = 'YouTube' | 'Spotify';
const getCode = () => {
    // const code = getJsonFromUrl(window.location.href)
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code")

    console.log(code)
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
    let data;
    try{
        let res = await fetch(`http://localhost:3000/spotify/${url}`)
        // console.log(res)
        data = await res.json()
        // console.log(data)
    }
    catch(error){
        console.error(error)
    }
    return data
}
const auth = () => {
    console.log("authenticating...")
    const code = getCode()
    console.log(code)
    const res = fetchRequest(`access/${code}`)

    return res
}
// const getPlaylist = (playlists: Array<) => {


// }
const getMarkedPlaylists = (playlists: Array<PlaylistObj>) => {
    const markedPlaylists = []
    for(let playlist of playlists){
        if(playlistsMarks[playlist.key]){
            markedPlaylists.push(playlist)
        }
    }
    return markedPlaylists
}
const goNext = async (playlists: Array<PlaylistObj>, setCurrentDownloadedCount: Function, setTotalToDownload: Function) => {
    let markedPlaylists: Array<PlaylistObj> = getMarkedPlaylists(playlists)
    let playlistsWithTracks: Array<PlaylistObjTracks> = [];
    
    let currentCount= 0
    setTotalToDownload(markedPlaylists.length)
    for (let playlist of markedPlaylists){
        const tracks = await fetchRequestJson(`tracks/${playlist.id}`);
        const tracksObjects = tracks.items.map((track: any) => {
            return {
                artists: track.track.artists.map((artist: any) => artist.name),
                "name": track.track.name,
            }
            
        })
        playlistsWithTracks.push({
            ...playlist,
            "tracks": tracksObjects
        })
        currentCount ++;
        setCurrentDownloadedCount(currentCount)

    }
    console.log(playlistsWithTracks)
    // console.log(JSON.stringify(playlistsWithTracks))
    // TODO: change storage to browser based not window based
    window.localStorage.setItem("playlists", JSON.stringify(playlistsWithTracks))
}
export default function SpotifyManager(){
    const [playlists, setPlaylists]: [Array<PlaylistObj>, Function] = useState([])
    const [playlistsElems, setPlaylistsElems]: [Array<object>, Function] = useState([])
    const [downloading, setDownloading]: [boolean, Function] = useState(false)
    const [totalToDownload, setTotalToDownload]: [number, Function] = useState(0)
    const [currentDownloadedCount, setCurrentDownloadedCount]: [number, Function] = useState(0)
    
    useEffect(() => {
        const initManager = async () => {
            const getPlaylists = async () => {
                
                const playlistsElemsTemp = []
                const playlistsTemp = []
                const userData = await fetchRequestJson(`playlists`)
                console.log(userData)
                let itemIndex = 0;
                for (let item of userData.items){
                    let itemObj: PlaylistObj = {
                        key: itemIndex,
                        name: item.name,
                        id: item.id,
                        href: item.tracks.href,
                        images: item.images
                    }
                    let itemProps: PlaylistProps = {
                        ...itemObj,
                        keyProp: itemIndex
                    }
                    
                    // playlistsElems.push(<Playlist {...itemObj}/>)
                    
                    let elem = <Playlist {...itemProps}/>;
                    playlistsElemsTemp.push(elem)
                    playlistsTemp.push(itemObj)
                    itemIndex++;
                    // setPlaylistsElems([...playlistsElems, elem])

                }
                setPlaylists(playlistsTemp)
                initPlaylistMarks(playlistsTemp)
                setPlaylistsElems(playlistsElemsTemp)
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
if(!downloading){

    return (
        <div id="SpotifyManager" className="noselect">
                
            <ul id="playlists">
                    {
                        playlistsElems 
                    }
            </ul>
            <div 
                id="button-next" 
                onClick={
                    e => {
                        goNext(
                            playlists, 
                            setCurrentDownloadedCount, 
                            setTotalToDownload
                        );
                        setDownloading(true)
                    }
                }
            >
    
                <div id="next">NEXT</div>
                <div id="arrow">{">"}</div>
    
            </div>
        </div>
        )
} else {
    return (
        <LoadingBar current={currentDownloadedCount} total={totalToDownload}/>
    )
}

}