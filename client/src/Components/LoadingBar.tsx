import { useState } from 'react';
import './LoadingBar.css'

interface LoadingBarProps{
    current: number;
    total: number;
}
export default function LoadingBar({current, total}: LoadingBarProps){
    total = total === 0 ? 1 : total;
    console.log(total, current)
    if(current === total){

        // TODO: here link to youtube auth
        // take the url from the props (based on what manager is used there ez)
        window.location.href = "http://127.0.0.1:3000/youtubetarget";
    }
    return (
        <div className="LoadingBar">
            <div className="loading-content">

                <div className="percentage">
                    <span>{`Uploading playlists data`}</span>
                    <span>{`${Math.round(100*current/total)}%`}</span>

                </div>
                <div 
                    style={{width: `${100*current/total}%`}}
                    className="bar"
                >
                    
                </div>
            </div>
        </div>
    )
}