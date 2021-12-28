import './Home.css';
import {useState} from 'react'


const login = async (setRedirect: Function, setUrl: Function, target: string) => {
    // fetch('/users/hello')
    // .then(res => res.json()) 
    // .then(users => console.log(users))
    console.log("login in")
    fetch(`/${target}/login`)
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

export default function Home(){
    const [redirect, setRedirect] = useState(false)
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
                        login(setRedirect, setUrl, "spotify")
                    }
                }>Spotify</button>
                <button className='start-button' onClick={(e) => 
                    {
                        login(setRedirect, setUrl, "youtube")
                    }
                }>Youtube</button>
            </div>

        </div>
    )
}