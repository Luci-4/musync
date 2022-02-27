import { url } from 'inspector';
import React, { useEffect, useState } from 'react';
import LoadingBar from './LoadingBar';
// import LoadingBar from './LoadingBar';
import Playlist, {PlaylistObj, PlaylistObjTracks, PlaylistProps} from './Playlist';
import './SpotifyManager.css'
var access_token: string; 
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

const login = async (setRedirect: Function, setUrl: Function, target: string) => {
    // fetch('/users/hello')
    // .then(res => res.json()) 
    // .then(users => console.log(users))
    console.log("login in")
    fetch(`/${target}/login/${target}target`)
    .then(res => res.json())
    .then(login => {
        console.log(login)
        let url: string = login[0]["url"];
        console.log("login", url)
        setRedirect(true)
        
        setUrl(url)
        }
    )
    .catch(err => {
        console.error(err)
    })
    // const url = await fetchRequest("/spotify/login")
    // console.log("url is:", url)

    // window.location.href = url;
    // let res = await fetch(`htt`) 
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
    const res = fetchRequest(`access/spotifymanager/${code}`)

    return res
}
// const getPlaylist = (playlists: Array<) => {


// }
const savePlaylistDataToCookies = (playlists: Array<PlaylistObjTracks>) => {
    let today = new Date()
    let expiry = new Date(today.getTime() + 30*24*3600*1000); // for 30 days from now
    document.cookie= "playlists" + "=" + escape(JSON.stringify(playlists)) + "; path=/; expires=" + expiry.toUTCString()
}
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
        const tracks = await fetchRequestJson(`${access_token}/tracks/${playlist.id}`);
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
    // savePlaylistDataToCookies(playlistsWithTracks)
}
export default function SpotifyManager(){
    const [playlists, setPlaylists]: [Array<PlaylistObj>, Function] = useState([])
    const [playlistsElems, setPlaylistsElems]: [Array<object>, Function] = useState([])
    const [downloading, setDownloading]: [boolean, Function] = useState(false)
    const [totalToDownload, setTotalToDownload]: [number, Function] = useState(0)
    const [currentDownloadedCount, setCurrentDownloadedCount]: [number, Function] = useState(0)
    const [redirect, setRedirect] = useState(false)
    const [url, setUrl] = useState("")
    if (redirect && url.length > 0){
        window.location.href = url
    }
    console.log(currentDownloadedCount, totalToDownload)
    if (currentDownloadedCount === totalToDownload  && totalToDownload !== 0){
        login(setRedirect, setUrl, "youtube")
    }
    useEffect(() => {
        const initManager = async () => {
            const getPlaylists = async () => {
                
                const playlistsElemsTemp = []
                const playlistsTemp = []
                const userData = await fetchRequestJson(`${access_token}/playlists`)
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
                access_token = await auth();
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
                <div className="panel">
                    <div>

                    </div>
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
            
                        <div id="next">CONFIRM</div>
                        {/* <div id="arrow">{">"}</div> */}
            
                    </div>
                </div>
            </div>
            )
    } else {
        return (
            <LoadingBar current={currentDownloadedCount} total={totalToDownload}/>
        )
    }

}