import { useEffect, useState } from "react"
import LoadingBar from "./LoadingBar"
import { PlaylistObjTracks, TrackObj } from "./Playlist"
import "./YoutubeTarget.css"

const mainUrl = "http://127.0.0.1:3000/"
var access_token: string;
const fetchRequst = async (path: string) => {
    let res = await fetch(`http://localhost:3000/youtube/${path}`)
    return res
}
const createPlaylist = async (title: string) => {

    let res = await fetchRequst(`/${access_token}/createplaylist/`+title)
    let resJson = await res.json()
    console.log(resJson)
    return resJson
}
const searchForTrack = async (query: string) => {
    let res = await fetchRequst("search/"+query)
    let resJson = await res.json()
    // console.log(resJson)
    return resJson
}
const addToPlaylist = async(playlistId: string, itemId: string, position: number) => {
    await fetchRequst(`/${access_token}/addtoplaylist/` + playlistId + "/" + itemId + "/" + `${position}`)

}
const auth = async () => {
    let hash = window.location.hash.substring(1)

    let params: {[key: string]: string;} = {}
    for(let item of hash.split("&")){
        let parts = item.split("=")
        let paramKey = parts[0]
        let paramValue = parts[1]
        params[paramKey] = paramValue
    }
    access_token = params["access_token"];

}
export default function YoutubeTarget() {
    const [currentLoadedCount, setCurrentLoadedCount]: [number, Function] = useState(0)
    const PLAYLISTS: PlaylistObjTracks[] = JSON.parse(window.localStorage.getItem("playlists") ?? "[]");
    const [totalToLoad, setTotalToLoad]: [number, Function] = useState(PLAYLISTS.reduce(
                (
                    accumulator, 
                    p: PlaylistObjTracks
                ) => accumulator+p.tracks.length, 
                0
    ));

    const [loading, setLoading]: [boolean, Function] = useState(false);
    const [redirect, setRedirect] = useState(false)
    const [error, setError] = useState(false);
    const [url, setUrl] = useState("")
    if (redirect && mainUrl.length > 0){
        window.location.href = mainUrl;
    }
    useEffect(() => {
        const authWrapper = async () => {
            await auth()
            
            setLoading(true)
            let current = 0
            for(let playlist of PLAYLISTS){
                // create playlist
                let res = await createPlaylist(playlist.name);
                console.log(res)
                if(!res[0].ok){
                    setError(true)
                    break;
                }
                else{
                    setError(false)
                }
                let playlistId = res[0].id;
                // TODO: fix bug with not setting '?' char in playlist title (for example pigeon? -> pigeon)
                for (let position = 0; position < playlist.tracks.length; position++){
                    const track = playlist.tracks[position];
                    let query = encodeURIComponent(`${track.artists.join(",")},${track.name.split(" ").join(",")}`)
                    let result = await searchForTrack(query) 
                    let videoId = result[0].result;
                    
                    await addToPlaylist(playlistId, videoId, position)
                    current++;
                    setCurrentLoadedCount(current)
                    
                    console.log(playlist.name, track.name, currentLoadedCount, totalToLoad)

                }
            }
            // TODO add something to signal the error if the condition is false (idk why would it be, but i guess might make sense)
            if (current === totalToLoad && totalToLoad !==0){
                console.log("redirect is now true")
                setRedirect(true)
            }
        }
        
        authWrapper()
    }, [])
    if(error){

        return (
            <div id="YoutubeTarget">
                    {"Sorry, that's just google being google, no more actions for today"}<br/>{"Come back tomorrow"} 
            </div>
        )
    }
    else if(loading){
        return (
            <LoadingBar current={currentLoadedCount} total={totalToLoad}/>
        )
    }
    else{

        return (
            <div id="YoutubeTarget">
                    {"Loading succesful"} 
            </div>
        )
    }
}