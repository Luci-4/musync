import './App.css';
import Home from './Components/Home';
import SpotifyManager from './Components/SpotifyManager'

import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route element={<Home/>} path='/'></Route>
          <Route element={<SpotifyManager/>} path='/spotifymanager'></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
