import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';

// Import components
import Home from './components/Home/Home';
import LandingPage from './components/LandingPage/LandingPage';

// Styled Components for the minimalist design
const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #FFF2BD;
  overflow: hidden;
  position: relative;
`;

function App() {
  return (
    <Router>
      <AppContainer className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat/:language" element={<Home />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
