import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import RealTime from './pages/RealTime';
import History from './pages/History';

function App() {
  return (
    <BrowserRouter>
      <NavBar/>
      <div className="container-fluid">
        <Routes>
          <Route path="/history" element={<History/>}/>
          <Route path="/realtime" element={<RealTime/>}/>
          <Route path="/" element={<Home/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
