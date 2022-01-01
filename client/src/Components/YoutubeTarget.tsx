import { useEffect } from "react"
const fetchRequst = async (path: string) => {
    let res = await fetch(`http://localhost:3000/youtube/${path}`)
    console.log(res)
    return res
}
const createPlaylist = async (title: string) => {
    console.log("creating playlists")
    // let res = await fetchRequst(`create/playlist/${encodeURIComponent(title)}`)
    // let res = await fetchRequst(`create/playlist/asdf`)
    // let res = await fetchRequst("test")
    // let res = await fetchRequst("create")
    let res = await fetchRequst(`createplaylist/`+title)
    let resJson = await res.json()
    console.log(resJson)
    return resJson
}
const searchForTrack = async (query: string) => {
    let res = await fetchRequst("search/"+query)
    let resJson = await res.json()
    console.log(resJson)
    return resJson
}
const addToPlaylist = async(playlistId: string, itemId: string, position: number) => {
    await fetchRequst("addtoplaylist/" + playlistId + "/" + itemId + "/" + `${position}`)

}
const auth = async () => {
    console.log("authenticating")

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
    console.log(params)
    // console.log(queryString)
    // const urlParams = new URLSearchParams(queryString)

    // const token = urlParams.get("access_token")
    const token = params["access_token"]

    const res = await fetchRequst(`access/${token}`)
    console.log(res)
    return res
}
export default function YoutubeTarget() {
    useEffect(() => {
        const authWrapper = async () => {
            await auth()
            const PLAYLISTS = JSON.parse(window.localStorage.getItem('playlists') ?? "[]");
            console.log(PLAYLISTS)

            // for(let playlist of PLAYLISTS){
            //     // create playlist
            //     let res = await createPlaylist(playlist.name)
            //     let playlistId = res[0].id;
            //     console.log("tracks", playlist.name)
            //     console.log("track count", playlist.tracks.length)
            //     for (let [position, track] of playlist.tracks.entries()){
            //         let query = encodeURIComponent(`${track.artists.join(",")},${track.name.split(" ").join(",")}`)
            //         console.log("before search", `${track.artists.join(",")},${track.name.split(" ").join(",")}`)
            //         let result = await searchForTrack(query) 
            //         console.log("after search", track.name)
            //         let videoId = result[0].result;
            //         console.log("found", videoId)
                    
            //         addToPlaylist(playlistId, videoId, position)
            //         console.log("after add", track.name)


            //     }
            // }
        }
        authWrapper()
    })
    return (
        <div id="YoutubeTarget">
            
        </div>
    )
}