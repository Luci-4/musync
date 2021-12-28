import './App.css';
import Home from './Components/Home';
import SpotifyManager from './Components/SpotifyManager'
import SpotifyTarget from './Components/SpotifyTarget';
import YoutubeManager from './Components/YoutubeManager';
import YoutubeTarget from './Components/YoutubeTarget';

import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route element={<Home/>} path='/'></Route>
          <Route element={<SpotifyManager/>} path='/spotifymanager'></Route>
          <Route element={<YoutubeManager/>} path='/youtubemanager'></Route>
          <Route element={<SpotifyTarget/>} path='/spotifytarget'></Route>
          <Route element={<YoutubeTarget/>} path='/youtubetarget'></Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
