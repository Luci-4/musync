// const playlists_url = `https://api.spotify.com/v1/users/${user_id}/playlists`;

// const playlists_url = "https://api.spotify.com/v1/users/wizzler/playlists"
// https://open.spotify.com/artist/4skJp5OKvcc9eKokiuhi2s?si=TgdoEQXPSRCtO48YdBxahQ
const playlists_url = "https://api.spotify.com/v1/tracks/2KrxsD86ARO5beq7Q0Drfqa"

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
function getJsonFromUrl(url) {
  if(!url) url = location.search;
  var query = url.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}
const getCode = () => {
    // const code = getJsonFromUrl(window.location.href)
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    const code = urlParams.get('code')
    return code
}
const showPlaylists = async () => {
    // const code = await showData()
    // const userData = await fetchRequest(`user`)
    // console.log(userData)
    // auth(code)
    // console.log(code)
}
const login = async () => {
    const url = await fetchRequest("login")
    console.log(url)
    window.location.href = url;
    // let res = await fetch(`htt`) 
}
// const auth = async () => {
//   const code = showData()
//   const res = await fetchRequest(`access/${code}`)
//   // const data = await res.json()
//   // console.log(data)
//   // return data

// }