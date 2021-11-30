import './App.css';
import Home from './components/Home';
import SpotifyManager from './components/SpotifyManager'

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
