import './App.css';
import Home from './Components/Home';
import SpotifyManager from './Components/SpotifyManager'
import YoutubeManager from './Components/YoutubeManager';

import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route element={<Home/>} path='/'></Route>
          <Route element={<SpotifyManager/>} path='/spotifymanager'></Route>
          <Route element={<YoutubeManager/>} path='/youtubemanager'></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
