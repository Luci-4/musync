
var PLAYLISTS = []
const fetchRequest = async (url) => {
    console.log("connecting to the cock")
    let res = await fetch(`http://localhost:3000/${url}`)
    console.log(res)
    let data = await res.text()
    console.log(data)
    return data
    // const res = await fetch(`http://localhost:3000/${url}`, { mode: 'no-cors' })
    // return await res.json()
    // const parsed = await res.text()
    // const parsed = res;
    // console.log(parsed.length)
    // return parsed
}
const fetchRequestJson = async (url) => {
    let res = await fetch(`http://localhost:3000/${url}`)
    console.log(res)
    let data = await res.json()
    console.log(data)
    return data
}
const getCode = () => {
    // const code = getJsonFromUrl(window.location.href)
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    const code = urlParams.get('code')
    return code
}
const auth = () => {
  console.log("authenticating...")
  const code = getCode()
  const res = fetchRequest(`access/${code}`)
  return res
//   const data = await res.json()
//   console.log("there is res", data)
//   return res
  // console.log(data)
  // return data
//   return res

}
const createPlaylistElement = (playlist) => {

    const playlist_li = document.getElementsByClassName("playlist-template")[0].cloneNode(true)
    playlist_li.className = "playlist unmarked clickable noselect";
    playlist_li.id = playlist.key;

    const name_element = playlist_li.getElementsByClassName("playlist-name")[0]
    const image_element = playlist_li.getElementsByClassName("playlist-image")[0]
    // console.log(playlist.name, playlist.images[playlist.images.length - 1])
    // console.log(playlist)
    
    image_element.src = playlist.images?.[0]?.url || "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2/image-size/original?v=mpbl-1&px=-1" 
    // console.log(name_element)
    name_element.innerHTML = playlist.name
    // playlist_li.getElementsByClassName("playlist-name").innerHTML = playlist.name;

    return playlist_li
}
const createPlaylistElements = () => {
    const playlists_list = document.getElementById("playlists")
    for(let playlist of PLAYLISTS){
        const playlist_li = createPlaylistElement(playlist)
        playlists_list.appendChild(playlist_li)


    }
}
const mark_playlist = (id) => {
    const playlist_element = document.getElementById(id) 
    if (playlist_element.classList.contains("marked")){
        playlist_element.classList.remove("marked")
        playlist_element.classList.add("unmarked")

    }
    else {
        playlist_element.classList.add("marked")
        playlist_element.classList.remove("unmarked")
    }
}
const showPlaylists = async () => {
    // const code = await showData()
    const userData = await fetchRequestJson(`playlists`)
    // console.log("here", userData.items)
    let item_index = 0;
    for(let item of userData.items){
        PLAYLISTS.push({
            key: item_index,
            name: item.name,
            id: item.id,
            href: item.tracks.href,
            images: item.images

        })
        item_index ++;

    }
    // console.log(PLAYLISTS)
    createPlaylistElements()
    // auth(code)
    // console.log(code)
}
const getMarkedPlaylists = () => {
    const playlists = document.getElementsByClassName("playlist")
    const marked_playlists_ids = []
    for(let playlistElem of playlists){
        if (playlistElem.classList.contains("marked")){
            playlistElem.classList.remove("clickable")
            playlistElem.removeAttribute("onclick");
            marked_playlists_ids.push(parseInt(playlistElem.id, 10))
        }
    }
    return marked_playlists_ids;
}
const goNext = () => {
    const markedPlaylists = []
    const markedPlaylistsIds = getMarkedPlaylists();
    for(let id of markedPlaylistsIds){
       markedPlaylists.push(PLAYLISTS[id])
    }
    cleanAllUnmarked(markedPlaylistsIds)
    // remove all playlists elements that arent in markedPlaylists
    // showPlaylists()
}
const cleanAllUnmarked = (markedPlaylistsIds) =>{

    const playlists = Array.prototype.slice.call(document.getElementsByClassName("playlist"))
    const allIds = playlists.map(playlistElem => parseInt(playlistElem.id, 10))
    const unmarkedIds = allIds.filter(id => !(markedPlaylistsIds.includes(id)))
    let currentPlaylistElemIndex = 0
    let currentPlaylistElem = playlists[currentPlaylistElemIndex]
    let currentPlaylistId = currentPlaylistElem.id
    const lastIndex = allIds.length - 1
    const playlistRemoveTimeoutCallback = () => {
        currentPlaylistElem = playlists[currentPlaylistElemIndex]
        
        if(currentPlaylistElemIndex > lastIndex){
            return;
        }
        let currentId = parseInt(currentPlaylistElem.id, 10);
        currentPlaylistElemIndex++;
        let delay = 0;
        if (unmarkedIds.includes(currentId)){
            currentPlaylistElem.remove()
            delay = 50
        }
        
        setTimeout(playlistRemoveTimeoutCallback, delay)
    }
    playlistRemoveTimeoutCallback()
    // playlists.forEach(playlistElem => {


    //         // console.log(playlistElem.id, unmarkedIds)
    //         // console.log(playlistElem)
    //         setTimeout(playlistRemoveTimeoutCallback, 500)
    //         break;

    //     }
    // })
}

// const startup = () => {
//     auth()

// }
console.log("Fuck you fucking hell");
(async () =>  {

    try{
        await auth()
        showPlaylists()
    }
    catch(error){
        console.error(error)
    }
})()

// )
