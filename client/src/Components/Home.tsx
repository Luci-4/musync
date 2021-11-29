import './Home.css'
const playlists_url = "https://api.spotify.com/v1/tracks/2KrxsD86ARO5beq7Q0Drfqa";

const fetchRequest = async (url: string) => {
    console.log("connecting to the cock")
    let res = await fetch(`http://localhost:3000/${url}`)
    console.log(res)
    let data = await res.text()
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

const login = async () => {
    // const url = await fetchRequest("login")
    // console.log("url is:", url)
    // window.location.href = url;
   fetch('/users')
   .then(res => res.json()) 
   .then(users => console.log(users))
    // let res = await fetch(`htt`) 
}

export default function Home(){
    return (
        <div className='Home'>

            <h1 className='title'>Sync Your cringe PissBaby playlists</h1>
            <div className='start-button-wrapper'>

                <button className='start-button' onClick={login}>START</button>
            </div>

        </div>
    )
}