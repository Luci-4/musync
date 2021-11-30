import React from 'react';
// import './Manager.css'

// export type Origin = 'YouTube' | 'Spotify';
export enum Origin {
    YouTube = 'YouTube',
    Spotify = 'Spotify'
}


type ManagerProps = {
    playlistOrigin: Origin
}

