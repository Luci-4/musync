import { useEffect, useState } from "react"
import LoadingBar from "./LoadingBar"
import { PlaylistObjTracks, TrackObj } from "./Playlist"
import "./YoutubeTarget.css"

const mainUrl = "http://127.0.0.1:3000/"
const fetchRequst = async (path: string) => {
    let res = await fetch(`http://localhost:3000/youtube/${path}`)
    // console.log(res)
    return res
}
const createPlaylist = async (title: string) => {

    let res = await fetchRequst(`createplaylist/`+title)
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
    await fetchRequst("addtoplaylist/" + playlistId + "/" + itemId + "/" + `${position}`)

}
const auth = async () => {
    // console.log("authenticating")

    // const queryString = window.location.search
    // console.log(window.location.hash)
    let hash = window.location.hash.substring(1)

    let params: {[key: string]: string;} = {}
    for(let item of hash.split("&")){
        let parts = item.split("=")
        let paramKey = parts[0]
        let paramValue = parts[1]
        params[paramKey] = paramValue
    }
    // let result = hash.split("&").reduce(function (res: [key: string]: any[], item: string) {
    //     let parts: Array<string> = item.split("=");
    //     res[parts[0]] = parts[1];
    //     return res;
    // })
    // console.log(params)
    // console.log(queryString)
    // const urlParams = new URLSearchParams(queryString)

    // const token = urlParams.get("access_token")
    const token = params["access_token"]

    const res = await fetchRequst(`access/${token}`)
    // console.log(res)
    return res
}
export default function YoutubeTarget() {
    const [currentLoadedCount, setCurrentLoadedCount]: [number, Function] = useState(0)
    const [totalToLoad, setTotalToLoad]: [number, Function] = useState(0);
    const [loading, setLoading]: [boolean, Function] = useState(false);
    const [redirect, setRedirect] = useState(false)
    const [error, setError] = useState(false);
    const [url, setUrl] = useState("")
    if (redirect && url.length > 0){
        window.location.href = url
    }
    if (currentLoadedCount === totalToLoad && totalToLoad !==0){
        setRedirect(true)
    }
    useEffect(() => {
        const authWrapper = async () => {
            await auth()
            
            const PLAYLISTS: PlaylistObjTracks[] = JSON.parse(window.localStorage.getItem('playlists') ?? "[]");

            const total = PLAYLISTS.reduce(
                (
                    accumulator, 
                    p: PlaylistObjTracks
                ) => accumulator+p.tracks.length, 
                0
                );
            setTotalToLoad(total);
            setLoading(true)
            let current = 0
            for(let playlist of PLAYLISTS){
                // create playlist
                let res = await createPlaylist(playlist.name);
                console.log(res)
                if(!res.OK){
                    setError(true)
                    break;
                }
                let playlistId = res[0].id;
                // for (let [position, track]:[number,TrackObj] of playlistTracksEntries){
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
        }
        
        authWrapper()
        // TODO: fix the infinite refresh bug
        setUrl(mainUrl)
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