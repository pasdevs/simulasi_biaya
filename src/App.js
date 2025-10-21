import React from 'react';
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
// import Home from '../src/pages/Home';
// import Versi2 from './pages/Versi2';
// import LandingPage from './pages/LandingPage';
import SimulasiBiayaFinal from './pages/SimulasiBiayaFinal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/landing_page" exact element={<LandingPage />} /> */}
        <Route path="/simulasi_biaya" exact element={<SimulasiBiayaFinal />} />
        <Route path="*" element={<Navigate replace to="/simulasi_biaya" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
