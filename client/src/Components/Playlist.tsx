import { useState } from 'react'
import './Playlist.css'
// type PlaylistProps = {

// }
export interface PlaylistImageObj {
    height: number;
    url: string;
    width: number;
}

export interface PlaylistObj {
    key: number;
    name: string;
    id: string;
    href: string;
    images: Array<PlaylistImageObj>;
}
export default function Playlist(props: PlaylistObj){
    const [marked, setMarked] = useState(false)
    const [clickable, setClickable] = useState(true)
    return (
        <li className={`playlist noselect ${clickable ? "clickable" : ""} ${marked ? "marked" : "unmarked"}`} onClick={() => {setMarked(!marked)}}>

            <img className='playlist-image' alt={`playlist ${props.name} cover`}src={props.images?.[0]?.url || "https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2/image-size/original?v=mpbl-1&px=-1"}></img>
            <div className='playlist-name'>{props.name}</div>
        </li>
    )
}