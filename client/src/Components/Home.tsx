import './Home.css';
import {Navigate} from 'react-router';
import {useState} from 'react'
import { Origin } from './Manager';

const playlists_url = "https://api.spotify.com/v1/tracks/2KrxsD86ARO5beq7Q0Drfqa";

const fetchRequest = async (url: string) => {
    console.log("connecting to the cock")
    let res = await fetch(`http://localhost:3001/${url}`)
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

const login = async (origin: Origin, setRedirect: Function, setUrl: Function) => {
    fetch('/users/hello')
    .then(res => res.json()) 
    .then(users => console.log(users))
    fetch('/spotify/login')
    .then(res => res.json())
    .then(login => {
        console.log(login)
        let url: string = login[0]["url"];
        console.log("login", url)
        setRedirect(true)
        
        setUrl(url)
        }
    )
    // const url = await fetchRequest("/spotify/login")
    // console.log("url is:", url)

    // window.location.href = url;
    // let res = await fetch(`htt`) 
}

export default function Home(){
    const [redirect, setRedirect] = useState(false)
    const [origin, setOrigin] = useState(Origin.Spotify)
    const [url, setUrl] = useState("undefined")
    if (redirect && url.length > 0){
        console.log("redirecting")
        console.log(url)
        window.location.href = url;
        // return (
        //     <Navigate to={url}/>
        // )

    }
    return (

        <div className='Home'>

            <h1 className='title'>Sync Your cringe PissBaby playlists</h1>
            <div className='start-button-wrapper'>

                <button className='start-button' onClick={(e) => 
                    {
                        login(origin, setRedirect, setUrl)
                    }
                }>START</button>
            </div>

        </div>
    )
}